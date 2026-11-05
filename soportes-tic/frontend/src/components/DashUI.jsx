import React, { useEffect, useState } from 'react';
import { Reveal } from './Reveal';

// Número que sube hasta el valor indicado
export const CountUp = ({ value, duration = 900 }) => {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame;
    const inicio = performance.now();
    const tick = (ahora) => {
      const p = Math.min(1, (ahora - inicio) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{shown}</>;
};

// Banner superior con ilustración
export const Banner = ({ titulo, texto, children }) => (
  <Reveal className="dash-banner">
    <div className="dash-banner-texto">
      <h2>{titulo}</h2>
      <p>{texto}</p>
    </div>
    <div className="dash-banner-img">{children}</div>
  </Reveal>
);

// Barras verticales animadas
export const BarrasChart = ({ datos, altura = 180 }) => {
  const max = Math.max(1, ...datos.map((d) => d.value));
  const ancho = Math.max(datos.length, 1) * 70;
  const alto = altura + 40;

  return (
    <div className="dc-barras-wrap">
      <svg
        width={ancho}
        height={alto}
        viewBox={`0 0 ${ancho} ${alto}`}
        className="dc-barras"
        role="img"
        aria-label="Gráfica de barras"
      >
        {datos.map((d, i) => {
          const h = (d.value / max) * (altura - 24);
          const x = i * 70 + 17;
          return (
            <g key={`${d.label}-${i}`}>
              <rect
                className="dc-bar"
                style={{ animationDelay: `${i * 0.08}s` }}
                x={x}
                y={altura - h}
                width="36"
                height={Math.max(h, 2)}
                rx="10"
                fill={d.color ?? '#0a84ff'}
              />
              <text x={x + 18} y={altura - h - 6} textAnchor="middle" className="dc-value">{d.value}</text>
              <text x={x + 18} y={altura + 22} textAnchor="middle" className="dc-label">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Donut con leyenda
export const DonaChart = ({ datos, centro }) => {
  const total = datos.reduce((s, d) => s + d.value, 0) || 1;
  const R = 70;
  const C = 2 * Math.PI * R;
  let acumulado = 0;

  return (
    <div className="dc-dona">
      <svg viewBox="0 0 200 200" className="dc-svg" role="img" aria-label="Gráfica de estados">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#2c2c2e" strokeWidth="22" />
        <g transform="rotate(-90 100 100)">
          {datos.map((d, i) => {
            const largo = (d.value / total) * C;
            const offset = -acumulado;
            acumulado += largo;
            return (
              <circle
                key={`${d.label}-${i}`}
                className="dc-seg"
                style={{ animationDelay: `${i * 0.15}s` }}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth="22"
                strokeDasharray={`${largo} ${C - largo}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </g>
        <text x="100" y="98" textAnchor="middle" className="dc-centro-num">{centro.valor}</text>
        <text x="100" y="120" textAnchor="middle" className="dc-centro-txt">{centro.texto}</text>
      </svg>
      <ul className="dc-leyenda">
        {datos.map((d) => (
          <li key={d.label}>
            <span style={{ background: d.color }} />
            {d.label}
            <strong>{d.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Línea con área, se dibuja sola
export const AreaChart = ({ datos }) => {
  const W = 600;
  const H = 220;
  const P = 24;
  const max = Math.max(1, ...datos.map((d) => d.value));
  const pts = datos.map((d, i) => ({
    x: P + (i * (W - 2 * P)) / Math.max(datos.length - 1, 1),
    y: H - P - (d.value / max) * (H - 2 * P),
  }));
  const linea = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const ultimo = pts[pts.length - 1];
  const primero = pts[0];
  const area = pts.length
    ? `${linea} L${ultimo.x.toFixed(1)} ${H - P} L${primero.x.toFixed(1)} ${H - P} Z`
    : '';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dc-svg" role="img" aria-label="Solicitudes por día">
      <defs>
        <linearGradient id="dcAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a84ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#0a84ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={P} x2={W - P} y1={P + (i * (H - 2 * P)) / 3} y2={P + (i * (H - 2 * P)) / 3} stroke="#2c2c2e" />
      ))}
      {area && <path d={area} fill="url(#dcAreaGrad)" className="dc-area" />}
      {linea && (
        <path d={linea} pathLength="1" fill="none" stroke="#64d2ff" strokeWidth="3" strokeLinecap="round" className="dc-linea" />
      )}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#000"
          stroke="#64d2ff"
          strokeWidth="2"
          className="dc-punto"
          style={{ animationDelay: `${0.6 + i * 0.05}s` }}
        />
      ))}
      {datos.map((d, i) =>
        i % Math.ceil(datos.length / 7) === 0 ? (
          <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle" className="dc-label">{d.label}</text>
        ) : null
      )}
    </svg>
  );
};