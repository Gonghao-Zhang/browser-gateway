import { describe, it, expect } from "vitest";
import { mcpSetupDoc } from "../../src/agent-tools/index.js";

const doc = mcpSetupDoc({ mcpUrl: "https://gateway.example.com/mcp", keySource: "Ask the user for the key." });

describe("mcpSetupDoc key handling", () => {
  it("never tells the agent to read the key from an environment variable", () => {
    expect(doc).not.toMatch(/bearer.token.env.var|env:|\$\{?[A-Z_]+_KEY\}?|BROWSER_GATEWAY_KEY/i);
    expect(doc).not.toMatch(/^export /m);
  });

  it("gives Codex a static header in its user config", () => {
    expect(doc).toContain('http_headers = { Authorization = "Bearer <key>" }');
    expect(doc).toContain("~/.codex/config.toml");
  });

  it("adds Claude Code at user scope so the key stays out of project files", () => {
    expect(doc).toContain("claude mcp add --transport http --scope user browser-gateway https://gateway.example.com/mcp");
    expect(doc).not.toContain(".mcp.json");
  });
});
