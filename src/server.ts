import express, { Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool, type CallToolResult } from "@modelcontextprotocol/sdk/types.js";

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
const PORT = process.env.PORT || 3000;

let sseTransport: SSEServerTransport | null = null;

app.get('/sse', async (req: Request, res: Response) => {
  console.error('Client established SSE connection');
  sseTransport = new SSEServerTransport('/message', res);
  await server.connect(sseTransport);

  req.on('close', () => {
    console.error('SSE connection closed');
    sseTransport = null;
  });
});

app.post('/message', async (req: Request, res: Response) => {
  if (!sseTransport) {
    res.status(400).send('SSE connection not active');
    return;
  }

  // Extract store domain & key from incoming client HTTP headers
  const domain = req.headers['x-idosell-domain'] as string | undefined;
  const apiKey = req.headers['x-idosell-api-key'] as string | undefined;

  // Run MCP request handler isolated within this client's context
  await requestContext.run({ domain, apiKey }, async () => {
    await sseTransport!.handlePostMessage(req, res);
  });
});

app.listen(PORT, () => {
  console.error(`Remote ${SERVER_NAME} MCP Server listening on port ${PORT}`);
});