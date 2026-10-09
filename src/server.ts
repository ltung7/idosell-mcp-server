import express, { Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema, isInitializeRequest, type Tool, type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

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
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: enrichInputSchema(def.inputSchema)
  }));
  return { tools: toolsForClient };
});

server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }

  // Retrieve current request headers context
  const ctx = requestContext.getStore();
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes, ctx);
});

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

interface Session {
  transport: SSEServerTransport | StreamableHTTPServerTransport;
}

const sessions = new Map<string, Session>();

app.get('/sse', async (req: Request, res: Response) => {
  console.error('Client established SSE connection');
  const transport = new SSEServerTransport('/message', res);
  
  sessions.set(transport.sessionId, { transport });

  transport.onclose = () => {
    sessions.delete(transport.sessionId);
    console.error('SSE connection closed');
  };

  await server.connect(transport);
});

app.all('/message', async (req: Request, res: Response) => {
  const domain = req.headers['x-idosell-domain'] as string | undefined;
  const apiKey = req.headers['x-idosell-api-key'] as string | undefined;

  await requestContext.run({ domain, apiKey }, async () => {
    let sessionId = req.query.sessionId as string | undefined;
    if (!sessionId) {
      sessionId = req.headers['mcp-session-id'] as string | undefined;
    }

    let transport: SSEServerTransport | StreamableHTTPServerTransport | undefined;

    if (sessionId) {
      transport = sessions.get(sessionId)?.transport;
    } else if (req.method === 'POST' && isInitializeRequest(req.body)) {
      const newTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          sessions.set(id, { transport: newTransport });
        }
      });
      newTransport.onclose = () => {
        if (newTransport.sessionId) {
          sessions.delete(newTransport.sessionId);
          console.error('Streamable HTTP connection closed');
        }
      };
      transport = newTransport;
      await server.connect(newTransport);
      console.error('Client established Streamable HTTP connection');
    } else if (sessions.size === 1 && !sessionId) {
      transport = Array.from(sessions.values())[0].transport;
    }

    if (!transport) {
      res.status(400).send('No active session or valid session ID provided');
      return;
    }

    try {
      if (transport instanceof SSEServerTransport) {
        if (req.method === 'POST') {
          await transport.handlePostMessage(req, res, req.body);
        } else {
          res.status(405).send('Method Not Allowed for SSE transport');
        }
      } else if (transport instanceof StreamableHTTPServerTransport) {
        await transport.handleRequest(req, res, req.body);
      }
    } catch (e) {
      console.error('Error handling message:', e);
    }
  });
});

app.listen(PORT, () => {
  console.error(`Remote ${SERVER_NAME} MCP Server listening on port ${PORT}`);
  console.error(`- Streamable HTTP endpoint: /message (GET/POST)`);
  console.error(`- SSE endpoint (deprecated): /sse (GET) -> /message (POST)`);
});