# IdoSell MCP Server

A universal Model Context Protocol (MCP) server generated from the IdoSell Admin API (v8.12) OpenAPI specification.

This server acts as a bridge between MCP-compliant AI assistants (like OpenCode, Claude Desktop, Cursor, and Windsurf) and your IdoSell store. It allows the AI to dynamically fetch products, manage subscriptions, and interact directly with your store's backend.

## Features

* **Universal Compatibility:** Works with any MCP-capable client out of the box.
* **Edge Optimized (Cloudflare Workers):** Extremely fast, zero-cold-start hosting on Cloudflare Workers using the official Streamable HTTP transport.
* **Stateless Proxy Architecture:** When running remotely on the edge, store credentials are never hardcoded or saved on the cloud server. They are passed securely via headers per request.
* **Prompt Overrides:** Tell the AI to switch domains or API keys dynamically during a conversation (e.g., *"Fetch product 102 using domain staging.shop.com"*).
* **Gemini & OpenAPI Compliant:** Includes strict JSON schema validation required by Gemini-based function calling (used by OpenCode and others), bypassing V8 `eval()` restrictions on Cloudflare by leveraging `ajv` inside the worker context.

---

## 1. Hosting on Cloudflare Workers (Remote)

This server is pre-configured to run on **Cloudflare Workers** utilizing the standard MCP Streamable HTTP transport. This gives you a globally distributed, free, and incredibly fast proxy for your AI assistants.

### Deployment
To deploy your own instance to Cloudflare:
```bash
npm install
npx wrangler deploy
```
*Wrangler will provide a URL like `https://api.<your-username>.workers.dev`.*

### Client Configuration
Point your AI client to your new Cloudflare URL (appending `/message` to the end). Pass your credentials securely using custom HTTP headers.

#### OpenCode Configuration
Add this to your `opencode.jsonc`:

```json
{
  "mcp": {
    "idosell": {
      "type": "remote",
      "url": "https://api.<your-username>.workers.dev/message",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  }
}
```
*(Tip: You can use `${env:IDOSELL_DOMAIN}` in your `opencode.jsonc` headers to dynamically inject secrets from your local machine's OS environment).*

#### Claude Desktop Configuration
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idosell": {
      "type": "sse",
      "url": "https://api.<your-username>.workers.dev/message",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  }
}
```

#### Continue.dev Configuration
Add this to your `~/.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "idosell",
      "type": "sse",
      "url": "https://api.<your-username>.workers.dev/message",
      "headers": {
        "X-Idosell-Domain": "your_shop_domain",
        "X-Idosell-Api-Key": "your_api_key"
      }
    }
  ]
}
```

#### Cursor IDE Configuration
Configure this directly in Cursor's settings UI (**Settings -> Features -> MCP Servers**):
* **Name:** `idosell`
* **Type:** `sse`
* **URL:** `https://api.<your-username>.workers.dev/message`
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
