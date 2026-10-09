import { AsyncLocalStorage } from 'node:async_hooks';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema, isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { 
    SERVER_NAME, 
    SERVER_VERSION, 
    toolDefinitionMap, 
    securitySchemes, 
    enrichInputSchema, 
    executeApiTool 
} from './common.js';

export interface RequestHeadersContext {
    domain?: string;
    apiKey?: string;
}

export const requestContext = new AsyncLocalStorage<RequestHeadersContext>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-idosell-domain, x-idosell-api-key, mcp-session-id',
  'Access-Control-Expose-Headers': 'mcp-session-id'
};

// Since Cloudflare Workers are heavily distributed and stateless, we instantiate 
// a completely fresh Server and Transport per incoming request to ensure absolute 
// isolation and avoid "Promise will never complete" / "Already connected" errors.
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/message') {
      const domain = request.headers.get('x-idosell-domain') || undefined;
      const apiKey = request.headers.get('x-idosell-api-key') || undefined;

      return await requestContext.run({ domain, apiKey }, async () => {
        try {
          let isInit = false;
          if (request.method === 'POST') {
            try {
              const bodyText = await request.clone().text();
              const bodyJson = JSON.parse(bodyText);
              isInit = bodyJson.method === 'initialize';
            } catch (e) {
              // Not valid JSON, ignore
            }
          }

          // 1. Create a fresh Server instance for this request boundary
          const reqServer = new Server(
              { name: SERVER_NAME, version: SERVER_VERSION },
              { capabilities: { tools: {} } }
          );

          reqServer.setRequestHandler(ListToolsRequestSchema, async () => {
            const toolsForClient = Array.from(toolDefinitionMap.values()).map(def => ({
              name: def.name,
              description: def.description,
              inputSchema: enrichInputSchema(def.inputSchema)
            }));
            return { tools: toolsForClient };
          });

          reqServer.setRequestHandler(CallToolRequestSchema, async (toolRequest) => {
            const { name: toolName, arguments: toolArgs } = toolRequest.params;
            const toolDefinition = toolDefinitionMap.get(toolName);
            if (!toolDefinition) {
              return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
            }

            const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
            const validatedArgs = argsToParse as any;
            
            const reqCtx = requestContext.getStore();
            const overrideDomain = toolArgs?.override_domain || validatedArgs?.override_domain;
            const overrideApiKey = toolArgs?.override_api_key || validatedArgs?.override_api_key;

            const domainToUse = overrideDomain || reqCtx?.domain || process.env.IDOSELL_DOMAIN || process.env.API_DOMAIN || process.env.DOMAIN;
            const apiKeyToUse = overrideApiKey || reqCtx?.apiKey || process.env.IDOSELL_API_KEY || process.env.API_KEY || process.env.APIKEY;

            if (!domainToUse) {
                return { content: [{ type: "text", text: "Error: No target domain provided via prompt, HTTP headers, or environment variables." }] };
            }

            let urlPath = toolDefinition.pathTemplate;
            const queryParams: Record<string, any> = {};
            const headers: Record<string, string> = { 'Accept': 'application/json' };
            let requestBodyData: any = undefined;

            toolDefinition.executionParameters.forEach((param) => {
                const value = validatedArgs[param.name];
                if (typeof value !== 'undefined' && value !== null) {
                    if (param.in === 'path') {
                        urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
                    } else if (param.in === 'query') {
                        queryParams[param.name] = value;
                    } else if (param.in === 'header') {
                        headers[param.name.toLowerCase()] = String(value);
                    }
                }
            });

            if (urlPath.includes('{')) {
                return { content: [{ type: "text", text: `Failed to resolve path parameters: ${urlPath}` }] };
            }

            const requestUrl = `https://${domainToUse.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/admin/v8${urlPath}`;

            if (toolDefinition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
                requestBodyData = validatedArgs['requestBody'];
                headers['content-type'] = toolDefinition.requestBodyContentType;
            }

            if (apiKeyToUse) {
                headers['x-api-key'] = String(apiKeyToUse);
            }
            
            try {
                const searchParams = new URLSearchParams();
                for (const [key, value] of Object.entries(queryParams)) {
                  if (value === undefined || value === null) continue;
                  searchParams.append(key, Array.isArray(value) ? value.join(',') : String(value));
                }
                const queryString = searchParams.toString();
                const finalUrl = queryString ? `${requestUrl}?${queryString}` : requestUrl;

                const fetchOptions: RequestInit = {
                    method: toolDefinition.method.toUpperCase(),
                    headers,
                };

                if (requestBodyData !== undefined) {
                    fetchOptions.body = typeof requestBodyData === 'string' ? requestBodyData : JSON.stringify(requestBodyData);
                }

                console.log(`[MCP] Executing tool "${toolName}": ${fetchOptions.method} ${finalUrl}`);

                const fetchResponse = await fetch(finalUrl, fetchOptions);
                
                let responseText = '';
                const contentType = String(fetchResponse.headers.get('content-type') ?? '').toLowerCase();
                
                if (contentType.includes('application/json')) {
                     try { 
                         const jsonData = await fetchResponse.json();
                         responseText = JSON.stringify(jsonData, null, 2); 
                     } catch { 
                         responseText = "[JSON Parse Error]"; 
                     }
                } else { 
                     responseText = await fetchResponse.text();
                }
                
                return { content: [{ type: "text", text: `API Response (Status: ${fetchResponse.status}):\n${responseText}` }] };
            } catch (error: any) {
                console.error(`Error during execution of tool '${toolName}':`, error.message);
                return { content: [{ type: "text", text: `API request failed: ${error.message}` }] };
            }
          });

          // 2. Create a purely stateless transport for this specific request
          const transport = new WebStandardStreamableHTTPServerTransport({
             sessionIdGenerator: undefined,
             enableJsonResponse: true 
          });

          // Connect the transport to our fresh server instance
          await reqServer.connect(transport);

          // HACK: Bypass MCP SDK state requirements for serverless environments.
          (reqServer as any)._initialized = !isInit;

          const response = await transport.handleRequest(request);
          
          // Append CORS headers to the transport's response
          const newHeaders = new Headers(response.headers);
          Object.entries(corsHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value);
          });
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        } catch (e) {
          console.error('Error handling message:', e);
          return new Response('Internal Server Error', { 
            status: 500,
            headers: corsHeaders
          });
        }
      });
    }

    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};
