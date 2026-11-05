import React, { useState } from 'react';
import { Logo } from './Logo';
import { Reveal } from './Reveal';
import { HeroEquipo, AsignacionIlustracion, TimelineIlustracion, DashboardIlustracion } from './Ilustraciones';
import { DocumentoLegal, reabrirCookies } from './Legal';
import './Landing.css';

const pasos = [
  { n: '1', titulo: 'Crea tu cuenta', texto: 'Con tu documento y correo, en menos de un minuto.' },
  { n: '2', titulo: 'Reporta el problema', texto: 'Describe qué pasa y en qué equipo ocurre.' },
  { n: '3', titulo: 'Sigue la solución', texto: 'Cada avance y diagnóstico queda registrado para ti.' },
];

// Enlaces de redes sociales: reemplaza el "#" por la dirección real de cada red
const redes = [
  {
    nombre: 'Facebook',
    href: '#',
    icono: <path d="M15 8h2.5V4.5H15a3.5 3.5 0 0 0-3.5 3.5v2H9V13h2.5v7H15v-7h2.5l.5-3.5h-3V8z" />,
  },
  {
    nombre: 'Instagram',
    href: '#',
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </>
    ),
  },
  {
    nombre: 'X',
    href: '#',
    icono: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    nombre: 'LinkedIn',
    href: '#',
    icono: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 11v6M8 8v.01M12 17v-6M12 13a2.5 2.5 0 0 1 4.5-1.5V17" />
      </>
    ),
  },
];

export const Landing = ({ onLogin, onRegister }) => {
  const [legal, setLegal] = useState(null);

  return (
    <div className="lp-root">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Logo size={28} />
          <div className="lp-nav-links">
            <a href="#servicios">Servicios</a>
            <a href="#admin">Administradores</a>
            <a href="#como">Cómo funciona</a>
          </div>
          <div className="lp-nav-acciones">
            <button className="lp-btn-sec" onClick={onLogin}>Iniciar sesión</button>
            <button className="lp-btn" onClick={onRegister}>Regístrate</button>
          </div>
        </div>
      </nav>

      <section className="lp-section lp-hero">
        <div className="lp-section-inner">
          <p className="lp-eyebrow">Mesa de ayuda TIC</p>
          <h1 className="lp-h1">Soporte técnico,<br />sin rodeos.</h1>
          <p className="lp-lead">
            Reporta la falla de tu equipo, sigue cada paso y recibe la solución. Todo en un solo lugar.
          </p>
          <div className="lp-cta-row">
            <button className="lp-btn lp-btn-lg" onClick={onRegister}>Crear cuenta</button>
            <button className="lp-btn-sec lp-btn-lg" onClick={onLogin}>Iniciar sesión ›</button>
          </div>
          <Reveal className="lp-hero-img"><HeroEquipo /></Reveal>
        </div>
      </section>

      <section id="servicios" className="lp-section">
        <div className="lp-section-inner">
          <Reveal><h2 className="lp-h2">Todo, en orden.</h2></Reveal>
          <Reveal delay={100}><p className="lp-lead">Desde el reporte hasta el cierre del caso.</p></Reveal>
          <div className="lp-tiles">
            <Reveal delay={0}>
              <article className="lp-tile">
                <h3>Asignación clara.</h3>
                <p>Cada solicitud llega al técnico responsable, sin correos perdidos.</p>
                <AsignacionIlustracion />
              </article>
            </Reveal>
            <Reveal delay={150}>
              <article className="lp-tile">
                <h3>Seguimiento en vivo.</h3>
                <p>Revisa el estado, el diagnóstico y la hora de cada movimiento.</p>
                <TimelineIlustracion />
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="admin" className="lp-section lp-alt">
        <div className="lp-section-inner">
          <Reveal><h2 className="lp-h2">Control total para administradores.</h2></Reveal>
          <Reveal delay={100}><p className="lp-lead">Usuarios, carga de trabajo y solicitudes en un solo panel.</p></Reveal>
          <Reveal className="lp-hero-img" delay={200}><DashboardIlustracion /></Reveal>
        </div>
      </section>

      <section id="como" className="lp-section">
        <div className="lp-section-inner">
          <Reveal><h2 className="lp-h2">Así de simple.</h2></Reveal>
          <div className="lp-steps">
            {pasos.map((p, i) => (
              <Reveal key={p.n} delay={i * 150}>
                <div className="lp-step">
                  <span className="lp-step-n">{p.n}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-alt">
        <Reveal>
          <h2 className="lp-h2">Tu equipo, atendido.</h2>
          <p className="lp-lead">Crea tu cuenta y reporta tu caso hoy.</p>
          <div className="lp-cta-row">
            <button className="lp-btn lp-btn-lg" onClick={onRegister}>Empezar</button>
          </div>
        </Reveal>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div>
              <Logo size={28} />
              <p>Mesa de ayuda para equipos y soporte técnico.</p>
            </div>
            <div className="lp-social-row">
              {redes.map((r) => (
                <a key={r.nombre} className="lp-social" href={r.href} aria-label={r.nombre} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {r.icono}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lp-footer-links">
            <button onClick={() => setLegal('terminos')}>Términos y condiciones</button>
            <button onClick={() => setLegal('privacidad')}>Política de privacidad</button>
            <button onClick={reabrirCookies}>Preferencias de cookies</button>
          </div>

          <p className="lp-copy">© {new Date().getFullYear()} Soportes TIC. Todos los derechos reservados.</p>
        </div>

        {legal && <DocumentoLegal tipo={legal} onClose={() => setLegal(null)} />}
      </footer>
    </div>
  );
};

export const AuthShell = ({ children, onBack }) => (
  <div className="lp-root af-shell">
    <div className="af-panel-izq">
      <Logo size={40} />
      <h2 className="af-hero-titulo">Tu soporte, <span>al alcance.</span></h2>
      <p className="af-hero-texto">Reporta, sigue y resuelve tus casos técnicos en un solo lugar.</p>
      <Reveal className="af-ilu"><HeroEquipo /></Reveal>
    </div>
    <div className="af-panel-der">
      <div className="af-contenido">
        <button className="lp-back" onClick={onBack}>‹ Volver al inicio</button>
        {children}
      </div>
    </div>
  </div>
);