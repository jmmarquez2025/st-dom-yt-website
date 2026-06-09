/**
 * Service Worker registration for PWA support.
 * Only registers in production builds; skipped during development.
 */
export function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  // Only register in production
  if (!import.meta.env.PROD) {
    console.log("[SW] Skipping registration in development mode.");
    return;
  }

  window.addEventListener("load", async () => {
    const swUrl = import.meta.env.BASE_URL + "sw.js";

    try {
      const registration = await navigator.serviceWorker.register(swUrl);
      if (import.meta.env.DEV) {
        console.log("[SW] Registered successfully. Scope:", registration.scope);
      }

      // Check for updates periodically (every 60 minutes)
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Handle waiting service worker (new version available)
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New content is available; optionally notify user
            if (import.meta.env.DEV) {
              console.log("[SW] New content available. Refresh to update.");
            }
          }
        });
      });
    } catch (error) {
      console.error("[SW] Registration failed:", error);
    }
  });
}

/**
 * Unregister all service workers (useful for debugging).
 */
export async function unregisterSW() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  if (import.meta.env.DEV) {
    console.log("[SW] Unregistered.");
  }
}
