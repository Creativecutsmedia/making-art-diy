// Hand-rolled SVG charts — no library

function BarChart({ data, labelKey, valueKey, height = 240, showTrend = true }) {
  const W = 560, H = height, pad = { t: 20, r: 16, b: 28, l: 16 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = Math.max(...data.map(d => d[valueKey])) * 1.15;
  const barW = innerW / data.length * 0.62;
  const step = innerW / data.length;

  const points = data.map((d, i) => {
    const x = pad.l + step * i + step / 2;
    const y = pad.t + innerH - (d[valueKey] / max) * innerH;
    return { x, y, v: d[valueKey], label: d[labelKey] };
  });

  const trendPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} className="grid-line" x1={pad.l} x2={W - pad.r}
          y1={pad.t + innerH * f} y2={pad.t + innerH * f} />
      ))}
      {points.map((p, i) => {
        const h = pad.t + innerH - p.y;
        return (
          <g key={i}>
            <rect className="bar" x={p.x - barW / 2} y={p.y} width={barW} height={h} rx="3"/>
          </g>
        );
      })}
      {showTrend && (
        <g>
          <path className="trend-line" d={trendPath} />
          {points.map((p, i) => (
            <circle key={i} className="trend-dot" cx={p.x} cy={p.y} r="3"/>
          ))}
        </g>
      )}
      {points.map((p, i) => (
        <text key={`v${i}`} className="axis-label" x={p.x} y={p.y - 8} textAnchor="middle" style={{ fontWeight: 600 }}>{p.v}</text>
      ))}
      {points.map((p, i) => (
        <text key={i} className="axis-label" x={p.x} y={H - 8} textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
}

function LineChart({ data, labelKey, valueKey, height = 260 }) {
  const W = 640, H = height, pad = { t: 20, r: 16, b: 28, l: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const max = Math.max(...data.map(d => d[valueKey])) * 1.15;
  const min = 0;
  const step = innerW / (data.length - 1);

  const points = data.map((d, i) => {
    const x = pad.l + step * i;
    const y = pad.t + innerH - ((d[valueKey] - min) / (max - min)) * innerH;
    return { x, y, v: d[valueKey], label: d[labelKey] };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${points[points.length - 1].x},${pad.t + innerH} L${points[0].x},${pad.t + innerH} Z`;

  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#C9963A" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#C9963A" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} className="grid-line" x1={pad.l} x2={W - pad.r}
          y1={pad.t + innerH * f} y2={pad.t + innerH * f} />
      ))}
      <path d={area} fill="url(#lineGrad)"/>
      <path d={path} fill="none" stroke="#C9963A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#C9963A" stroke="var(--card)" strokeWidth="2"/>
      ))}
      {points.map((p, i) => (
        <text key={i} className="axis-label" x={p.x} y={H - 8} textAnchor="middle">{p.label}</text>
      ))}
      {[0, 0.5, 1].map(f => (
        <text key={f} className="axis-label" x={pad.l - 6} y={pad.t + innerH * (1 - f) + 4} textAnchor="end">
          {Math.round(max * f / 1000 * 10) / 10}k
        </text>
      ))}
    </svg>
  );
}

function HBarChart({ data, height = 320 }) {
  // horizontal bar chart: { label, value }[]
  const W = 560, H = height;
  const rowH = (H - 10) / data.length;
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const labelW = 140;
  return (
    <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const y = 5 + i * rowH;
        const w = ((W - labelW - 50) * d.value) / max;
        return (
          <g key={i}>
            <text className="axis-label" x="8" y={y + rowH / 2 + 4}>{d.label}</text>
            <rect className="bar-bg" x={labelW} y={y + rowH * 0.22} width={W - labelW - 50} height={rowH * 0.56} rx="4"/>
            <rect className="bar" x={labelW} y={y + rowH * 0.22} width={w} height={rowH * 0.56} rx="4"/>
            <text className="axis-label" x={W - 8} y={y + rowH / 2 + 4} textAnchor="end" style={{ fontWeight: 600 }}>{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ data, size = 180, thickness = 22, centerLabel, centerSub }) {
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--chart-grid)" strokeWidth={thickness}/>
      {data.map((d, i) => {
        const frac = d.value / total;
        const len = frac * circ;
        const dasharray = `${len} ${circ - len}`;
        const dashoffset = -offset;
        offset += len;
        return (
          <circle key={i}
            cx={c} cy={c} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${c} ${c})`}
            strokeLinecap="butt"
          />
        );
      })}
      {centerLabel && (
        <>
          <text x={c} y={c - 2} textAnchor="middle" fill="var(--fg)" fontSize="22" fontWeight="600" letterSpacing="-0.02em">{centerLabel}</text>
          <text x={c} y={c + 18} textAnchor="middle" fill="var(--fg-soft)" fontSize="11">{centerSub}</text>
        </>
      )}
    </svg>
  );
}

Object.assign(window, { BarChart, LineChart, HBarChart, DonutChart });
