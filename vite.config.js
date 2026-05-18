import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/st-dom-yt-website/",
  // es2022 enables top-level await (used in src/i18n.js to lazy-load the
  // active locale chunk). Supported in Chrome 89+, Edge 89+, Firefox 89+,
  // Safari 15+ — fine for parish-website audience.
  build: { target: "es2022" },
  esbuild: { target: "es2022" },
});
