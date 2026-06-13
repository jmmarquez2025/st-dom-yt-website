/**
 * PageSkeleton — shimmer placeholder shown during lazy page loads.
 * Replaces the spinning loader with a layout-aware skeleton.
 */
export default function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-busy="true" aria-label="Loading page content">
      {/* Hero skeleton */}
      <div className="skeleton-block" style={{ height: "60vh", borderRadius: 0 }} />

      {/* Content skeleton */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        {/* Section title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div className="skeleton-block" style={{ width: 120, height: 12 }} />
          <div className="skeleton-block" style={{ width: 320, height: 32 }} />
          <div className="skeleton-block" style={{ width: 48, height: 2 }} />
        </div>

        {/* Text paragraphs */}
        <div className="skeleton-block" style={{ width: "100%", height: 14, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ width: "92%", height: 14, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ width: "85%", height: 14, marginBottom: 32 }} />

        {/* Card grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-block" style={{ height: 180, borderRadius: "var(--radius-card)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
