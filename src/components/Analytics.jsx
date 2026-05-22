import { useEffect } from "react";
import { CONFIG } from "../constants/config";

/**
 * Analytics — fallback injection for dev or builds without the static head tag.
 *
 * Production builds add the static snippet in vite.config.js so verification
 * tools can find it in page source. This guard prevents duplicate scripts.
 */
export default function Analytics() {
  useEffect(() => {
    if (!CONFIG.plausibleDomain) return;

    // Avoid injecting duplicate scripts
    if (document.querySelector('script[data-domain="' + CONFIG.plausibleDomain + '"]')) return;

    const script = document.createElement("script");
    script.defer = true;
    script.setAttribute("data-domain", CONFIG.plausibleDomain);
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
