import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const CLAVE_SESION = 'soportes_sesion';
const INACTIVIDAD_MS = 10 * 60 * 1000;   // 10 minutos
const REVISION_MS = 30 * 1000;           // revisar cada 30 segundos
const GUARDAR_ACTIVIDAD_MS = 10 * 1000;  // guardar actividad como máximo cada 10 segundos

const leerSesion = () => {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    if (!raw) return null;
    const { user, ultimaActividad } = JSON.parse(raw);
    if (!user || Date.now() - ultimaActividad > INACTIVIDAD_MS) {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
    return { user, ultimaActividad };
  } catch {
    return null;
  }
};

const guardarSesion = (user, ultimaActividad) => {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ user, ultimaActividad }));
  } catch {
    // Si el navegador bloquea el almacenamiento, la sesión dura solo mientras la página esté abierta
  }
};

const borrarSesion = () => {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Nada que hacer si no se puede borrar
  }
};

export const AuthProvider = ({ children }) => {
  const [inicial] = useState(() => leerSesion());
  const [user, setUser] = useState(inicial?.user ?? null);
  const ultimaActividad = useRef(inicial?.ultimaActividad ?? Date.now());
  const ultimoGuardado = useRef(0);

  const iniciarSesion = (u) => {
    const ahora = Date.now();
    ultimaActividad.current = ahora;
    ultimoGuardado.current = ahora;
    guardarSesion(u, ahora);
    setUser(u);
  };

  const login = async (email, password) => {
    const u = await authService.login(email, password);
    iniciarSesion(u);
  };

  const register = async (datos) => {
    const u = await authService.registrarUsuario(datos);
    iniciarSesion(u);
  };

  const logout = useCallback(() => {
    borrarSesion();
    setUser(null);
  }, []);

  // Actividad del usuario y cierre por inactividad
  useEffect(() => {
    if (!user) return;

    const registrarActividad = () => {
      const ahora = Date.now();
      ultimaActividad.current = ahora;
      if (ahora - ultimoGuardado.current > GUARDAR_ACTIVIDAD_MS) {
        ultimoGuardado.current = ahora;
        guardarSesion(user, ahora);
      }
    };

    const eventos = ['mousedown', 'keydown', 'mousemove', 'scroll', 'touchstart'];
    eventos.forEach((ev) => window.addEventListener(ev, registrarActividad, { passive: true }));

    const revisar = setInterval(() => {
      if (Date.now() - ultimaActividad.current > INACTIVIDAD_MS) {
        logout();
        alert('Tu sesión se cerró por inactividad.');
      }
    }, REVISION_MS);

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, registrarActividad));
      clearInterval(revisar);
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);