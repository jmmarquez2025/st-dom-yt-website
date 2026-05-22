import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function plausibleAnalytics() {
  return {
    name: "plausible-analytics",
    apply: "build",
    transformIndexHtml() {
      const domain = process.env.VITE_PLAUSIBLE_DOMAIN?.trim();

      if (!domain) return [];

      return [
        {
          tag: "script",
          attrs: {
            defer: true,
            "data-domain": domain,
            src: "https://plausible.io/js/script.js",
          },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), plausibleAnalytics()],
  base: "/st-dom-yt-website/",
  // es2022 enables top-level await (used in src/i18n.js to lazy-load the
  // active locale chunk). Supported in Chrome 89+, Edge 89+, Firefox 89+,
  // Safari 15+ — fine for parish-website audience.
  build: { target: "es2022" },
  esbuild: { target: "es2022" },
});
