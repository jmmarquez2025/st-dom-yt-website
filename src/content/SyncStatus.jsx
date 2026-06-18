import { useState, useEffect } from "react";
import { T } from "../constants/theme";
import { getStatus, subscribe, isConfigured } from "../cms/adminSync";

/**
 * A quiet header chip that surfaces what the (otherwise invisible, fire-and-
 * forget) sync is doing — so editors know their work is saved. Reuses the
 * existing adminSync status feed; no new plumbing.
 */
export default function SyncStatus() {
  const [status, setStatus] = useState(() => getStatus());
  useEffect(() => subscribe(setStatus), []);

  const configured = isConfigured();
  let dot = T.warmGray;
  let label = "Saved on this device";

  if (configured) {
    if (status.error) {
      dot = "#B7791F";
      label = "Saved here — sync issue";
    } else if (status.pending && status.pending.length > 0) {
      dot = T.gold;
      label = "Syncing…";
    } else if (status.lastPushedAt || status.lastPulledAt) {
      dot = "#2E7D32";
      label = "Saved to cloud";
    }
  }

  return (
    <span
      title={status.error || label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 12.5,
        color: T.warmGray,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}
