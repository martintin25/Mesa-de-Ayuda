import React, { useEffect, useState } from 'react';
import { soporteService } from '../services/soporteService';
import { historialService } from '../services/historialService';
import { useAuth } from '../context/AuthContext';
import { ESTADO_INICIAL, ESTADO_RESUELTO, PRIORIDADES, CATEGORIAS } from '../config/constants';
import { CountUp, Banner } from './DashUI';
import { HeroEquipo } from './Ilustraciones';
import './AdminDashboard.css';
import './Portales.css';

const slug = (t = '') =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

const NuevaSolicitud = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [prioridad, setPrioridad] = useState('Media');
  const [idEquipo, setIdEquipo] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    soporteService.obtenerEquipos().then(setEquipos).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const estados = await soporteService.obtenerEstados();
      const inicial = estados[0];
      if (!inicial) throw new Error('No hay estados registrados en estados_solicitud');
      await soporteService.crearSoporte({
        descripcion,
        categoria,
        prioridad,
        id_equipo: idEquipo ? Number(idEquipo) : null,
        id_solicitante: user.id_usuario,
        id_estado: inicial.id_estado,
        fecha_creacion: new Date().toISOString(),
      });
      onSuccess();
    } catch (err) {
      alert('Error al crear la solicitud: ' + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="adm-overlay">
      <form className="adm-glass adm-modal" onSubmit={handleSubmit}>
        <h2>Nueva solicitud de soporte</h2>

        <label className="adm-label">¿Qué problema tienes?</label>
        <textarea className="adm-input" rows="4" value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} required />

        <label className="adm-label">Categoría</label>
        <select className="adm-input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="adm-label">Prioridad</label>
        <select className="adm-input" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
          {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <label className="adm-label">Equipo (opcional)</label>
        <select className="adm-input" value={idEquipo} onChange={(e) => setIdEquipo(e.target.value)}>
          <option value="">-- Seleccione un equipo --</option>
          {equipos.map((eq) => (
            <option key={eq.id_equipo} value={eq.id_equipo}>
              {eq.placa_inventario} {eq.marca ? `- ${eq.marca}` : ''}
            </option>
          ))}
        </select>

        <div className="adm-ticket-acciones" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ClienteDashboard = () => {
  const { user, logout } = useAuth();
  const [soportes, setSoportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [abierto, setAbierto] = useState(null);
  const [historial, setHistorial] = useState({});

  const cargar = async () => {
    try {
      setLoading(true);
      setError('');
      setSoportes(await soporteService.obtenerSoportes(user));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [user]);

  const resueltas = soportes.filter((s) => s.estado?.nombre === ESTADO_RESUELTO).length;
  const enCurso = soportes.length - resueltas;

  const verHistorial = async (id) => {
    if (abierto === id) {
      setAbierto(null);
      return;
    }
    setAbierto(id);
    if (!historial[id]) {
      try {
        const h = await historialService.obtenerHistorial(id);
        setHistorial((prev) => ({ ...prev, [id]: h }));
      } catch (err) {
        alert('No se pudo cargar el historial: ' + err.message);
      }
    }
  };

  return (
    <div className="adm-root">
      <header className="adm-glass adm-header adm-enter" style={{ '--i': 0 }}>
        <div>
          <h1>Mis solicitudes de soporte</h1>
          <p>{user.nombre} · <span className="adm-pill">Solicitante</span></p>
        </div>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => setMostrarForm(true)}>+ Nueva solicitud</button>
          <button className="adm-btn adm-btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {mostrarForm && (
        <NuevaSolicitud
          onCancel={() => setMostrarForm(false)}
          onSuccess={() => { setMostrarForm(false); cargar(); }}
        />
      )}

      {loading && <p className="adm-status">Cargando...</p>}
      {error && <p className="adm-status adm-error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <Banner titulo="Estamos para ayudarte" texto="Reporta un problema y sigue cada avance desde aquí.">
            <HeroEquipo />
          </Banner>

          <section className="adm-stats">
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 1 }}>
              <span>Mis solicitudes</span><strong><CountUp value={soportes.length} /></strong>
            </div>
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 2 }}>
              <span>En curso</span><strong><CountUp value={enCurso} /></strong>
            </div>
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 3 }}>
              <span>Resueltas</span><strong><CountUp value={resueltas} /></strong>
            </div>
          </section>

          {soportes.length === 0 ? (
            <p className="adm-empty">Aún no tienes solicitudes. Crea la primera con el botón de arriba.</p>
          ) : (
            <div className="adm-cards" style={{ marginTop: 20 }}>
              {soportes.map((s, i) => (
                <article key={s.id_ticket} className="adm-glass adm-ticket adm-enter" style={{ '--i': i % 8 }}>
                  <div className="adm-ticket-top">
                    <small>Ticket #{s.id_ticket}</small>
                    <span className={`adm-estado ${slug(s.estado?.nombre)}`}>{s.estado?.nombre}</span>
                  </div>
                  <h3>{s.categoria}</h3>
                  <p>{s.descripcion}</p>
                  <div className="adm-ticket-top">
                    <span className={`adm-prio ${slug(s.prioridad)}`}>{s.prioridad}</span>
                    <small>{s.fecha_creacion ? new Date(s.fecha_creacion).toLocaleDateString() : ''}</small>
                  </div>
                  <small>
                    Técnico: {s.tecnico ? `${s.tecnico.primer_nombre} ${s.tecnico.primer_apellido}` : 'Por asignar'}
                  </small>

                  <div className="adm-ticket-acciones">
                    <button className="adm-btn adm-btn-ghost" onClick={() => verHistorial(s.id_ticket)}>
                      {abierto === s.id_ticket ? 'Ocultar historial' : 'Ver historial'}
                    </button>
                  </div>

                  {abierto === s.id_ticket && (
                    <ul className="adm-historial">
                      {(historial[s.id_ticket] || []).length === 0 && <li>Sin movimientos registrados.</li>}
                      {(historial[s.id_ticket] || []).map((h, idx) => (
                        <li key={idx}>
                          <strong>{new Date(h.fecha_registro).toLocaleString()}</strong>
                          <br />{h.comentario}
                          <br /><small>{h.usuario ? `${h.usuario.primer_nombre} ${h.usuario.primer_apellido}` : ''}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};