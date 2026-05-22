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
    if (!CONFIG.cloudflareWebAnalyticsToken) return;

    // Avoid injecting duplicate scripts
    if (document.querySelector("script[data-cf-beacon]")) return;

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute(
      "data-cf-beacon",
      JSON.stringify({ token: CONFIG.cloudflareWebAnalyticsToken }),
    );
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
