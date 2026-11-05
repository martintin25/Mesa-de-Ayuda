import React, { useEffect, useState } from 'react';

const CLAVE_COOKIES = 'soportes_cookies';
const EVENTO_RESET = 'cookies-reset';

const leerConsentimiento = () => {
  try {
    return localStorage.getItem(CLAVE_COOKIES);
  } catch {
    return null;
  }
};

const guardarConsentimiento = (valor) => {
  try {
    localStorage.setItem(CLAVE_COOKIES, valor);
  } catch {
    // Si el navegador bloquea el almacenamiento, el aviso volverá a aparecer
  }
};

// Vuelve a mostrar el aviso de cookies
export const reabrirCookies = () => {
  try {
    localStorage.removeItem(CLAVE_COOKIES);
  } catch {
    // Nada que hacer
  }
  window.dispatchEvent(new Event(EVENTO_RESET));
};

export const CookieBanner = () => {
  const [visible, setVisible] = useState(() => !leerConsentimiento());

  useEffect(() => {
    const mostrar = () => setVisible(true);
    window.addEventListener(EVENTO_RESET, mostrar);
    return () => window.removeEventListener(EVENTO_RESET, mostrar);
  }, []);

  if (!visible) return null;

  const elegir = (valor) => {
    guardarConsentimiento(valor);
    setVisible(false);
  };

  return (
    <div className="ck-banner" role="dialog" aria-label="Aviso de cookies">
      <div className="ck-texto">
        <strong>Usamos cookies</strong>
        <p>
          Usamos cookies necesarias para mantener tu sesión y, si lo aceptas, cookies para mejorar tu experiencia.
        </p>
      </div>
      <div className="ck-acciones">
        <button className="ck-btn-sec" onClick={() => elegir('solo-necesarias')}>Solo necesarias</button>
        <button className="ck-btn" onClick={() => elegir('todas')}>Aceptar todas</button>
      </div>
    </div>
  );
};

const DOCUMENTOS = {
  terminos: {
    titulo: 'Términos y condiciones',
    secciones: [
      ['1. Uso del servicio', 'Soportes TIC permite registrar, seguir y resolver solicitudes de soporte técnico. El acceso es personal e intransferible.'],
      ['2. Cuentas', 'Eres responsable de la confidencialidad de tu contraseña y de la información que registres.'],
      ['3. Solicitudes', 'Describe el problema con la mayor precisión posible. Los tiempos de atención dependen de la prioridad y de la disponibilidad del equipo técnico.'],
      ['4. Conducta', 'No está permitido usar el sistema para fines distintos al soporte técnico ni intentar acceder a información de otros usuarios.'],
      ['5. Cambios', 'Podemos actualizar estos términos. Los cambios importantes se comunicarán en la plataforma.'],
    ],
  },
  privacidad: {
    titulo: 'Política de privacidad',
    secciones: [
      ['Datos que recogemos', 'Documento, nombre, correo y los datos de las solicitudes de soporte que registras.'],
      ['Para qué los usamos', 'Para gestionar tu cuenta, asignar y atender tus solicitudes, y mantener el historial de cada caso.'],
      ['Cookies', 'Usamos el almacenamiento del navegador para mantener tu sesión y recordar tus preferencias de cookies.'],
      ['Tus derechos', 'Puedes pedir la consulta, corrección o eliminación de tus datos al administrador del sistema.'],
    ],
  },
};

export const DocumentoLegal = ({ tipo, onClose }) => {
  const doc = DOCUMENTOS[tipo];

  useEffect(() => {
    const cerrarConEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', cerrarConEsc);
    return () => window.removeEventListener('keydown', cerrarConEsc);
  }, [onClose]);

  if (!doc) return null;

  return (
    <div className="ck-overlay" onClick={onClose}>
      <div className="ck-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="ck-modal-head">
          <h2>{doc.titulo}</h2>
          <button className="ck-x" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="ck-modal-body">
          {doc.secciones.map(([titulo, texto]) => (
            <section key={titulo}>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </section>
          ))}
          <p className="ck-nota">Última actualización: noviembre de 2026.</p>
        </div>
      </div>
    </div>
  );
};