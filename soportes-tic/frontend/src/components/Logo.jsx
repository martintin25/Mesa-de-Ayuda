import React from 'react';

export const Logo = ({ size = 40, showText = true }) => (
  <div className="lp-logo">
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="lpLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2997ff" />
          <stop offset="1" stopColor="#0071e3" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#lpLogoGrad)" />
      <rect x="16" y="18" width="32" height="22" rx="4" fill="none" stroke="#fff" strokeWidth="3.5" />
      <path d="M26 46h12M32 40v6" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M24 29l5 5 11-11" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {showText && <span>Soportes<b>TIC</b></span>}
  </div>
);