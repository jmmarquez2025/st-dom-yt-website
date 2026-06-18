import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./styles/global.css";
import { installContentOverrides } from "./content/applyOverrides";
import { applyImageOverrides } from "./content/images";
import { applyBranding } from "./content/branding";
import App from "./App";
import { registerSW } from "./registerSW";

// Layer dashboard-edited page text, image swaps, and brand colors onto their
// sources before the first paint, so visitors never flash the shipped values.
// i18n is already fully initialised here (src/i18n.js uses a top-level await).
installContentOverrides();
applyImageOverrides();
applyBranding();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA (production only)
registerSW();
