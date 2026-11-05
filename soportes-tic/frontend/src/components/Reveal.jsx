import React, { useEffect, useRef, useState } from 'react';

// Se activa al entrar en pantalla y se desactiva al salir, en cada desplazamiento
export const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      const r = el.getBoundingClientRect();
      const alto = window.innerHeight;
      setVisible(r.top < alto * 0.88 && r.bottom > alto * 0.12);
    };
    const programar = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(revisar);
      }
    };

    revisar();
    // capture: true para escuchar el desplazamiento de cualquier contenedor, no solo de la ventana
    document.addEventListener('scroll', programar, { capture: true, passive: true });
    window.addEventListener('resize', programar);
    return () => {
      document.removeEventListener('scroll', programar, { capture: true });
      window.removeEventListener('resize', programar);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};