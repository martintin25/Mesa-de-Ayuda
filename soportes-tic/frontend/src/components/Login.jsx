import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
      setCargando(false);
    }
  };

  return (
    <div>
      <p className="af-kicker">Bienvenido de nuevo</p>
      <h2 className="af-titulo">Inicia sesión.</h2>
      {error && <p className="af-error">{error}</p>}
      <form className="af-form" onSubmit={handleSubmit}>
        <div className="af-field">
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="af-field">
          <label htmlFor="login-pass">Contraseña</label>
          <input
            id="login-pass"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="af-btn" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Continuar'}
        </button>
      </form>
      <p className="af-pie">
        ¿No tienes cuenta?{' '}
        <button type="button" className="af-link" onClick={onSwitchToRegister}>Regístrate</button>
      </p>
    </div>
  );
};