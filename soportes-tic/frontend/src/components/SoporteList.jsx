import React, { useEffect, useState } from 'react';
import { soporteService } from '../services/soporteService';
import { useAuth } from '../context/AuthContext';
import { SoporteForm } from './SoporteForm';
import { ROLES } from '../config/constants';

export const SoporteList = () => {
  const { user, logout } = useAuth();
  const [soportes, setSoportes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const puedeCrear = user.rol === ROLES.ADMIN || user.rol === ROLES.COORDINADOR;

  const cargarSoportes = async () => {
    try {
      setLoading(true);
      const data = await soporteService.obtenerSoportes(user);
      setSoportes(data);
    } catch (err) {
      alert('Error al cargar soportes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSoportes();
    soporteService.obtenerEstados().then(setEstados).catch(() => console.error('Error al cargar estados'));
  }, [user]);

  const cambiarEstado = async (ticket) => {
    if (estados.length === 0) return;
    const idx = estados.findIndex((e) => e.id_estado === ticket.id_estado);
    const siguiente = estados[(idx + 1) % estados.length];
    try {
      await soporteService.cambiarEstado(ticket, siguiente, user);
      cargarSoportes();
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div>
          <h2>Panel de Gestión - Soportes TIC</h2>
          <p>Usuario: <strong>{user.nombre}</strong> | Rol: <span className="role-badge">{user.rol}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {puedeCrear && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Registrar Soporte</button>
          )}
          <button className="btn-cancel" onClick={logout}>Cerrar Sesión</button>
        </div>
      </header>

      {showForm && (
        <SoporteForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); cargarSoportes(); }}
        />
      )}

      {loading ? (
        <p className="status-message">Cargando solicitudes acordes a tu perfil...</p>
      ) : (
        <div className="cards-grid">
          {soportes.length === 0 ? (
            <p>No hay solicitudes asignadas o registradas para tu perfil.</p>
          ) : soportes.map((s) => (
            <div key={s.id_ticket} className="persona-card">
              <h3>Ticket #{s.id_ticket} - {s.categoria}</h3>
              <p><strong>Descripción:</strong> {s.descripcion}</p>
              <p><strong>Prioridad:</strong> <span className={`badge ${s.prioridad?.toLowerCase()}`}>{s.prioridad}</span></p>
              <p><strong>Estado:</strong> {s.estado?.nombre}</p>
              <p><strong>Equipo:</strong> {s.equipo ? `${s.equipo.placa_inventario} ${s.equipo.marca ?? ''}` : 'No especificado'}</p>
              {user.rol !== ROLES.TECNICO && (
                <p><strong>Técnico Asignado:</strong>{' '}
                  {s.tecnico ? `${s.tecnico.primer_nombre} ${s.tecnico.primer_apellido}` : 'Sin asignar'}
                </p>
              )}
              <div style={{ marginTop: '15px' }}>
                <button className="btn-edit" onClick={() => cambiarEstado(s)}>Cambiar Estado</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
