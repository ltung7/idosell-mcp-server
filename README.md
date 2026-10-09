# IdoSell MCP Server

A universal Model Context Protocol (MCP) server generated from the IdoSell Admin API (v8.12) OpenAPI specification.

This server acts as a bridge between MCP-compliant AI assistants (like OpenCode, Claude Desktop, Cursor, and Windsurf) and your IdoSell store. It allows the AI to dynamically fetch products, manage subscriptions, and interact directly with your store's backend.

## Features

* **Universal Compatibility:** Works with any MCP-capable client out of the box.
* **Ready to Use:** A globally distributed, extremely fast, zero-cold-start public instance is hosted on Cloudflare's Edge and ready to be plugged into your AI assistant immediately.
* **Stateless Proxy Architecture:** Store credentials are never hardcoded or saved on the cloud server. They are passed securely via headers per request, making the public proxy 100% safe to use.
* **Prompt Overrides:** Tell the AI to switch domains or API keys dynamically during a conversation (e.g., *"Fetch product 102 using domain staging.shop.com"*).
* **Gemini & OpenAPI Compliant:** Includes strict JSON schema validation required by Gemini-based function calling (used by OpenCode and others).

---

## Quick Start (Using the Public Edge Proxy)

The easiest way to use this MCP server is to connect to the public instance hosted on Cloudflare's global edge network. Because the proxy is completely stateless, your API keys and store data remain secure—they are only passed through to the IdoSell API.

Configure your AI client to point to `https://api.idosell-mcp-server.workers.dev/message` and provide your credentials via HTTP headers.

### OpenCode Configuration
Add this to your `opencode.jsonc`:

```json
{
  "mcp": {
    "idosell": {
      "type": "remote",
      "url": "https://api.idosell-mcp-server.workers.dev/message",
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
      "type": "remote",
      "url": "https://api.idosell-mcp-server.workers.dev/message",
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
      "type": "remote",
      "url": "https://api.idosell-mcp-server.workers.dev/message",
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
* **Type:** `remote` (or Custom)
* **URL:** `https://api.idosell-mcp-server.workers.dev/message`
* **Headers:** 
  * `X-Idosell-Domain`: `your_shop_domain`
  * `X-Idosell-Api-Key`: `your_api_key`

---

## Alternative Hosting Methods (Advanced)

### Deploy Your Own Cloudflare Worker

If you prefer to host the remote proxy yourself, this server is pre-configured to be deployed to your own Cloudflare account.

```bash
npm install
npx wrangler deploy
```
*Wrangler will provide your own URL like `https://api.<your-username>.workers.dev`. Swap the public URL with yours in the configuration.*

### Running Locally (`stdio`)

If you prefer to run the server entirely locally on your own machine (without HTTP/remote transport), you can build and run it directly.

#### Installation & Build
```bash
npm install
npm run build
```

*(Optional)* Create a `.env` file in the root of your project to store default credentials:
```env
IDOSELL_DOMAIN=your_shop_domain
IDOSELL_API_KEY=your_api_key
```

#### OpenCode Configuration (Local)
Configure your client to point to the compiled `index.js` file using `stdio`.

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