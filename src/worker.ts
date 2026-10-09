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

const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: enrichInputSchema(def.inputSchema)
  }));
  return { tools: toolsForClient };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }

  // Cloudflare Workers restrict dynamic code evaluation (eval/new Function).
  // Libraries like Ajv and jsonSchemaToZod+eval use these features.
  // Since the LLM generates arguments based on the schema and the target API
  // handles ultimate validation, we can safely bypass strict schema validation here.
  const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
  const validatedArgs = argsToParse as any;
  // Retrieve current request headers context for this specific request boundary
  const ctx = requestContext.getStore();
  
  const overrideDomain = toolArgs?.override_domain || validatedArgs?.override_domain;
  const overrideApiKey = toolArgs?.override_api_key || validatedArgs?.override_api_key;

  // Resolve Domain
  const domainToUse = overrideDomain || ctx?.domain || process.env.IDOSELL_DOMAIN || process.env.API_DOMAIN || process.env.DOMAIN;
  
  // Resolve API Key
  const apiKeyToUse = overrideApiKey || ctx?.apiKey || process.env.IDOSELL_API_KEY || process.env.API_KEY || process.env.APIKEY;

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

      const response = await fetch(finalUrl, fetchOptions);
      
      let responseText = '';
      const contentType = String(response.headers.get('content-type') ?? '').toLowerCase();
      
      if (contentType.includes('application/json')) {
           try { 
               const jsonData = await response.json();
               responseText = JSON.stringify(jsonData, null, 2); 
           } catch { 
               responseText = "[JSON Parse Error]"; 
           }
      } else { 
           responseText = await response.text();
      }
      
      return { content: [{ type: "text", text: `API Response (Status: ${response.status}):\n${responseText}` }] };
  } catch (error: any) {
      console.error(`Error during execution of tool '${toolName}':`, error.message);
      return { content: [{ type: "text", text: `API request failed: ${error.message}` }] };
  }
});

// Store transports for active sessions in this isolate
const sessions = new Map<string, WebStandardStreamableHTTPServerTransport>();

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/message') {
      const domain = request.headers.get('x-idosell-domain') || undefined;
      const apiKey = request.headers.get('x-idosell-api-key') || undefined;

      // Ensure that context is safely contained within this request's AsyncLocalStorage boundary
      return await requestContext.run({ domain, apiKey }, async () => {
        let sessionId = url.searchParams.get('sessionId') || request.headers.get('mcp-session-id') || undefined;
        let transport: WebStandardStreamableHTTPServerTransport | undefined;

        if (sessionId && sessions.has(sessionId)) {
          transport = sessions.get(sessionId);
        } else if (request.method === 'POST') {
          // Check if this is an initialization request
          const bodyText = await request.clone().text();
          let isInit = false;
          try {
            const bodyJson = JSON.parse(bodyText);
            isInit = isInitializeRequest(bodyJson);
          } catch (e) {
            // Not a valid JSON or not an initialize request
          }

          if (isInit) {
            transport = new WebStandardStreamableHTTPServerTransport({
              sessionIdGenerator: () => crypto.randomUUID(), // Web Crypto API
              onsessioninitialized: (id) => {
                sessions.set(id, transport!);
              },
              onsessionclosed: (id) => {
                sessions.delete(id);
              }
            });
            
            await server.connect(transport);
          }
        }

        // Fallback for isolated local test tools that do not provide session IDs
        if (!transport && sessions.size === 1 && !sessionId) {
          transport = Array.from(sessions.values())[0];
        }

        if (!transport) {
          return new Response('No active session or valid session ID provided', { status: 400 });
        }

        try {
          return await transport.handleRequest(request);
        } catch (e) {
          console.error('Error handling message:', e);
          return new Response('Internal Server Error', { status: 500 });
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
