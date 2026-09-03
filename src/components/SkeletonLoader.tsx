"use client";

export function CourseSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="courses-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel skeleton-card">
          <div className="skeleton skeleton-thumb" />
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="skeleton skeleton-text" style={{ width: "35%", height: 16 }} />
            <div className="skeleton skeleton-text" style={{ width: "85%", height: 24 }} />
            <div className="skeleton skeleton-text" style={{ width: "100%", height: 14 }} />
            <div className="skeleton skeleton-text" style={{ width: "70%", height: 14 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div className="skeleton skeleton-text" style={{ width: "30%", height: 14 }} />
              <div className="skeleton skeleton-text" style={{ width: "30%", height: 14 }} />
            </div>
            <div className="skeleton skeleton-btn" style={{ marginTop: 12 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-panel" style={{ padding: 24, textAlign: "center" }}>
          <div className="skeleton skeleton-text" style={{ width: "50%", height: 36, margin: "0 auto 8px" }} />
          <div className="skeleton skeleton-text" style={{ width: "70%", height: 14, margin: "0 auto" }} />
        </div>
      ))}
    </div>
  );
}
