# IdoSell MCP Server

A universal Model Context Protocol (MCP) server generated from the IdoSell Admin API (v8.12) OpenAPI specification.

This server acts as a bridge between MCP-compliant AI assistants (like OpenCode, Claude Desktop, Cursor, and Windsurf) and your IdoSell store. It allows the AI to dynamically fetch products, manage subscriptions, and interact directly with your store's backend.

## Features

* **Universal Compatibility:** Works with any MCP-capable client out of the box.
* **Dual Transport:** Run locally on your machine via `stdio` or host in the cloud via HTTP/`SSE` (Server-Sent Events).
* **Stateless Proxy Architecture:** When running remotely, store credentials are never hardcoded or saved on the cloud server. They are passed securely via headers per request.
* **Prompt Overrides:** Tell the AI to switch domains or API keys dynamically during a conversation (e.g., *"Fetch product 102 using domain staging.shop.com"*).
* **Gemini & OpenAPI Compliant:** Includes strict JSON schema sanitization required by Gemini-based function calling (used by OpenCode and others).

---

## 1. Using a Remote Cloud Server (SSE)

You can host this server on 100% free platforms like **Render.com** (or Railway/Fly.io) as a multi-tenant proxy. Cloud platforms will handle the installation and build processes automatically. You just need to configure your AI client to connect to your deployed URL.

### OpenCode Configuration
Add this to your `opencode.jsonc`, replacing the URL with your cloud host URL. Pass your credentials securely using custom HTTP headers:

```json
{
  "mcp": {
    "idosell": {
      "type": "remote",
      "url": "https://idosell-mcp-server.onrender.com/sse",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  }
}
```
*(Tip: You can use `${env:IDOSELL_DOMAIN}` in your `opencode.jsonc` headers to dynamically inject secrets from your local machine's OS environment).*

### Claude Desktop Configuration
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idosell": {
      "url": "https://idosell-mcp-server.onrender.com/sse",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  }
}
```

### Continue.dev Configuration
Add this to your `~/.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "idosell",
      "url": "https://idosell-mcp-server.onrender.com/sse",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  ]
}
```

### Cursor IDE Configuration
Configure this directly in Cursor's settings UI (**Settings -> Features -> MCP Servers**):
* **Name:** `idosell`
* **Type:** `sse`
* **URL:** `https://idosell-mcp-server.onrender.com/sse`
* **Headers:** 
  * `X-Idosell-Domain`: `your_shop_domain`
  * `X-Idosell-Api-Key`: `your_api_key`

---

## 2. Running Locally (`stdio`)

If you prefer to run the server locally on your own machine instead of the cloud, you will need to install its dependencies and compile the TypeScript code.

### Installation & Build
```bash
npm install
npm run build
```

*(Optional)* Create a `.env` file in the root of your project to store default credentials:
```env
IDOSELL_DOMAIN=your_shop_domain
IDOSELL_API_KEY=your_api_key
```

### OpenCode Configuration (Local)
Configure your client to point to the compiled `index.js` file.

```json
{
  "mcp": {
    "idosell": {
      "type": "local",
      "command": ["node", "/path/to/idosell-mcp-server/build/index.js"]
    }
  }
}
```