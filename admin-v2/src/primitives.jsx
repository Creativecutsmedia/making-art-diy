// Shared primitives: Chip, Toggle, StatCard, TableWrap, Thumb, StatusChip

const { useState } = React;

function Chip({ kind, children }) {
  return <span className={`chip ${kind}`}>{children}</span>;
}

function CategoryChip({ category, t }) {
  const map = {
    voksne: { kind: 'gold', label: t('cat_voksne') },
    born: { kind: 'blue', label: t('cat_born') },
    erhverv: { kind: 'purple', label: t('cat_erhverv') },
  };
  const c = map[category];
  if (!c) return null;
  return <Chip kind={c.kind}>{c.label}</Chip>;
}

function StatusChip({ status, t }) {
  const map = {
    paid: { kind: 'warn', label: t('status_paid') },
    production: { kind: 'gold', label: t('status_production') },
    shipped: { kind: 'blue', label: t('status_shipped') },
    delivered: { kind: 'ok', label: t('status_delivered') },
  };
  const c = map[status];
  if (!c) return <Chip kind="muted">{status}</Chip>;
  return <Chip kind={c.kind}>{c.label}</Chip>;
}

function Toggle({ on, onChange }) {
  return (
    <div className={`toggle ${on ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onChange(!on); }}/>
  );
}

function StatCard({ icon, label, value, trend, trendDir, trendLabel }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <div className="stat-label" style={{ textAlign: 'right' }}>{label}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">
        <span className={`trend-pill ${trendDir === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trendDir === 'up' ? '↑' : '↓'} {trend}
        </span>
        <span>{trendLabel}</span>
      </div>
    </div>
  );
}

function Thumb({ kind }) {
  return <span className={`thumb ${kind || 'gold'}`} />;
}

function SectionLabel({ children }) {
  return <div className="sidebar-section-label">{children}</div>;
}

Object.assign(window, { Chip, CategoryChip, StatusChip, Toggle, StatCard, Thumb, SectionLabel });
