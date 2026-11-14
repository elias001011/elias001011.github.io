import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// O GitHub Pages não deixa configurar cabeçalhos, então a CSP vai por meta tag,
// só no build: em dev o Vite injeta scripts inline que ela bloquearia.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.github.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

function cspMeta(): Plugin {
  return {
    name: "csp-meta",
    apply: "build",
    transformIndexHtml: () => [
      { tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: csp }, injectTo: "head-prepend" },
    ],
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), cspMeta()],
  resolve: {
    alias: { "@": "/src" },
  },
});
