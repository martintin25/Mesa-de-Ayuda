import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ROLES } from '../config/constants';

export const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    documento: '', primer_nombre: '', segundo_nombre: '',
    primer_apellido: '', segundo_apellido: '', email: '', password: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      // El registro público entra como Solicitante
      const roles = await authService.obtenerRoles();
      const solicitante = roles.find((r) => r.nombre === ROLES.SOLICITANTE);
      if (!solicitante) throw new Error('No existe el rol Solicitante en la base de datos');

      await register({
        ...form,
        id_rol: solicitante.id_rol,
        segundo_nombre: form.segundo_nombre || null,
        segundo_apellido: form.segundo_apellido || null,
      });
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Verifique los datos.');
      setCargando(false);
    }
  };

  return (
    <div>
      <p className="af-kicker">Empieza hoy</p>
      <h2 className="af-titulo">Crea tu cuenta.</h2>
      {error && <p className="af-error">{error}</p>}
      <form className="af-form" onSubmit={handleSubmit}>
        <div className="af-field">
          <label htmlFor="reg-doc">Documento</label>
          <input id="reg-doc" placeholder="Número de documento" value={form.documento} onChange={set('documento')} required />
        </div>
        <div className="af-grid">
          <div className="af-field">
            <label htmlFor="reg-pn">Primer nombre</label>
            <input id="reg-pn" value={form.primer_nombre} onChange={set('primer_nombre')} required />
          </div>
          <div className="af-field">
            <label htmlFor="reg-sn">Segundo nombre</label>
            <input id="reg-sn" placeholder="Opcional" value={form.segundo_nombre} onChange={set('segundo_nombre')} />
          </div>
          <div className="af-field">
            <label htmlFor="reg-pa">Primer apellido</label>
            <input id="reg-pa" value={form.primer_apellido} onChange={set('primer_apellido')} required />
          </div>
          <div className="af-field">
            <label htmlFor="reg-sa">Segundo apellido</label>
            <input id="reg-sa" placeholder="Opcional" value={form.segundo_apellido} onChange={set('segundo_apellido')} />
          </div>
        </div>
        <div className="af-field">
          <label htmlFor="reg-email">Correo electrónico</label>
          <input id="reg-email" type="email" placeholder="tu@correo.com" value={form.email} onChange={set('email')} required />
        </div>
        <div className="af-field">
          <label htmlFor="reg-pass">Contraseña</label>
          <input id="reg-pass" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set('password')} required />
        </div>
        <button type="submit" className="af-btn" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="af-pie">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="af-link" onClick={onSwitchToLogin}>Inicia sesión</button>
      </p>
    </div>
  );
};