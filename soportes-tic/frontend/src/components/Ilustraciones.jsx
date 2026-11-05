import React from 'react';

const AZUL = '#0a84ff';
const CELESTE = '#64d2ff';
const VERDE = '#30d158';
const TARJETA = '#2c2c2e';
const TEXTO = '#f5f5f7';
const GRIS = '#8e8e93';

export const HeroEquipo = () => (
  <svg viewBox="0 0 900 480" role="img" aria-label="Equipo con solicitud atendida">
    <defs>
      <linearGradient id="ilBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0d2a4d" />
        <stop offset="1" stopColor="#1c1c1e" />
      </linearGradient>
      <linearGradient id="ilPantalla" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#0a84ff" />
        <stop offset="1" stopColor="#5e5ce6" />
      </linearGradient>
    </defs>
    <rect width="900" height="480" rx="36" fill="url(#ilBg)" />
    <rect x="230" y="90" width="440" height="280" rx="22" fill="#3a3a3c" />
    <rect x="252" y="112" width="396" height="236" rx="10" fill="url(#ilPantalla)" />
    <rect x="180" y="380" width="540" height="24" rx="12" fill="#56565a" />
    <rect x="300" y="150" width="300" height="130" rx="18" fill="#fff" />
    <circle cx="346" cy="215" r="26" fill={VERDE} className="il-pulse" />
    <path d="M334 215l9 9 17-19" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="392" y="190" width="170" height="11" rx="5.5" fill="#1d1d1f" opacity=".85" />
    <rect x="392" y="212" width="120" height="9" rx="4.5" fill="#86868b" opacity=".6" />
    <rect x="392" y="236" width="90" height="9" rx="4.5" fill="#86868b" opacity=".4" />
    <g className="il-float">
      <rect x="640" y="60" width="210" height="84" rx="20" fill={TARJETA} />
      <circle cx="680" cy="102" r="16" fill={AZUL} />
      <rect x="708" y="84" width="120" height="10" rx="5" fill={TEXTO} opacity=".9" />
      <rect x="708" y="106" width="90" height="9" rx="4.5" fill={GRIS} />
    </g>
  </svg>
);

export const AsignacionIlustracion = () => (
  <svg viewBox="0 0 600 380" role="img" aria-label="Solicitudes asignadas a técnicos">
    <rect width="600" height="380" rx="24" fill="#111113" />
    {[0, 1, 2].map((i) => {
      const y = 70 + i * 92;
      return (
        <g key={i}>
          <rect x="44" y={y} width="220" height="68" rx="16" fill={TARJETA} />
          <rect x="66" y={y + 20} width="120" height="10" rx="5" fill={TEXTO} opacity=".9" />
          <rect x="66" y={y + 40} width="78" height="8" rx="4" fill={GRIS} />
          <path
            className="il-flow"
            d={`M270 ${y + 34} C 310 ${y + 34} 320 190 352 190`}
            fill="none"
            stroke={AZUL}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
    })}
    <circle className="il-pulse" cx="430" cy="190" r="80" fill={AZUL} />
    <circle cx="430" cy="166" r="26" fill={TEXTO} />
    <path d="M378 262 Q430 206 482 262 Z" fill={TEXTO} />
    <rect x="486" y="238" width="78" height="64" rx="16" fill={TARJETA} />
    <circle cx="524" cy="270" r="16" fill={VERDE} />
    <path d="M516 270l6 6 11-13" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TimelineIlustracion = () => (
  <svg viewBox="0 0 600 380" role="img" aria-label="Seguimiento del caso">
    <rect width="600" height="380" rx="24" fill="#111113" />
    {[0, 1, 2, 3].map((i) => {
      const y = 50 + i * 82;
      const hecho = i < 3;
      return (
        <g key={i} className="il-step" style={{ '--i': i }}>
          {i < 3 && (
            <line x1="90" y1={y + 44} x2="90" y2={y + 82} stroke={hecho ? VERDE : '#48484a'} strokeWidth="4" />
          )}
          <circle cx="90" cy={y + 22} r="22" fill={hecho ? VERDE : TARJETA} stroke={hecho ? 'none' : '#48484a'} strokeWidth="2" />
          {hecho && (
            <path d={`M79 ${y + 22} l8 8 l15 -17`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <rect x="140" y={y + 10} width="290" height="12" rx="6" fill={TEXTO} opacity={hecho ? 0.9 : 0.3} />
          <rect x="140" y={y + 32} width="190" height="9" rx="4.5" fill={GRIS} opacity="0.7" />
          <rect x="460" y={y + 12} width="100" height="28" rx="14" fill={hecho ? '#163d24' : TARJETA} />
        </g>
      );
    })}
  </svg>
);

export const DashboardIlustracion = () => (
  <svg viewBox="0 0 900 440" role="img" aria-label="Panel de administración">
    <rect width="900" height="440" rx="32" fill="#111113" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={44 + i * 286} y="40" width="262" height="86" rx="20" fill={TARJETA} />
        <rect x={68 + i * 286} y="66" width="110" height="12" rx="6" fill={TEXTO} opacity=".9" />
        <rect x={68 + i * 286} y="90" width="60" height="10" rx="5" fill={GRIS} />
      </g>
    ))}
    {[150, 230, 120, 270, 190, 250, 170].map((h, i) => (
      <rect
        key={i}
        className="il-bar"
        x={62 + i * 54}
        y={400 - h}
        width="34"
        height={h}
        rx="12"
        fill={i % 2 ? AZUL : CELESTE}
        style={{ animationDelay: `${i * 0.08}s` }}
      />
    ))}
    <circle cx="710" cy="260" r="90" fill="none" stroke={TARJETA} strokeWidth="30" />
    <circle cx="710" cy="260" r="90" fill="none" stroke={AZUL} strokeWidth="30" strokeDasharray="300 565" transform="rotate(-90 710 260)" />
    <circle cx="710" cy="260" r="90" fill="none" stroke={VERDE} strokeWidth="30" strokeDasharray="120 565" strokeDashoffset="-300" transform="rotate(-90 710 260)" />
  </svg>
);