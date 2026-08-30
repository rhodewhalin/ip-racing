import { defineConfig } from "vite";

// `base` = the public path this build is served under.
//   - standalone / Vercel / local dev:  "/"        (default)
//   - KIPlay hub route:                 "/games/ip-racing/"
// Injected at build time via VITE_BASE_PATH (see deploy/client.Dockerfile).
// The trailing slash matters: Vite exposes it verbatim as import.meta.env.BASE_URL,
// and net.ts derives the same-origin Colyseus endpoint from it.
export default defineConfig({
  base: process.env["VITE_BASE_PATH"] || "/",
  server: { port: 5173 },
});
