import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function cloudflareWebAnalytics() {
  return {
    name: "cloudflare-web-analytics",
    apply: "build",
    transformIndexHtml() {
      const token = process.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

      if (!token) return [];

      return [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            "data-cf-beacon": JSON.stringify({ token }),
          },
          injectTo: "body",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), cloudflareWebAnalytics()],
  base: "/st-dom-yt-website/",
  // es2022 enables top-level await (used in src/i18n.js to lazy-load the
  // active locale chunk). Supported in Chrome 89+, Edge 89+, Firefox 89+,
  // Safari 15+ — fine for parish-website audience.
  build: { target: "es2022" },
  esbuild: { target: "es2022" },
});
