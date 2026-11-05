import React, { useEffect, useMemo, useState } from 'react';
import { soporteService } from '../services/soporteService';
import { useAuth } from '../context/AuthContext';
import { ESTADO_RESUELTO } from '../config/constants';
import { CountUp, Banner } from './DashUI';
import { TimelineIlustracion } from './Ilustraciones';
import './AdminDashboard.css';
import './Portales.css';

const slug = (t = '') =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

const nombreDePersona = (p) =>
  p ? `${p.primer_nombre ?? ''} ${p.primer_apellido ?? ''}`.trim() : 'Sin asignar';

const GestionSoporte = ({ ticket, estados, onCancel, onSaved }) => {
  const { user } = useAuth();
  const [idEstado, setIdEstado] = useState(String(ticket.id_estado ?? ''));
  const [diagnostico, setDiagnostico] = useState(ticket.diagnostico ?? '');
  const [traslado, setTraslado] = useState(!!ticket.traslado_taller);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    const nuevoEstado = estados.find((x) => x.id_estado === Number(idEstado));
    if (!nuevoEstado) return alert('Selecciona un estado');
    if (nuevoEstado.nombre === ESTADO_RESUELTO && !diagnostico.trim()) {
      return alert('Para marcar como resuelto debes escribir el diagnóstico.');
    }
    setGuardando(true);
    try {
      await soporteService.actualizarSoporte(
        ticket,
        nuevoEstado,
        { diagnostico: diagnostico.trim() || null, traslado_taller: traslado },
        user
      );
      onSaved();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="adm-overlay">
      <form className="adm-glass adm-modal" onSubmit={guardar}>
        <h2>Gestionar ticket #{ticket.id_ticket}</h2>
        <p><small>{ticket.categoria} · {ticket.descripcion}</small></p>

        <label className="adm-label">Estado</label>
        <select className="adm-input" value={idEstado} onChange={(e) => setIdEstado(e.target.value)}>
          {estados.map((x) => (
            <option key={x.id_estado} value={String(x.id_estado)}>{x.nombre}</option>
          ))}
        </select>

        <label className="adm-label">Diagnóstico técnico</label>
        <textarea
          className="adm-input"
          rows="4"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          placeholder="Qué encontraste y qué hiciste"
        />

        <label className="adm-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={traslado} onChange={(e) => setTraslado(e.target.checked)} />
          Equipo trasladado al taller
        </label>

        <div className="adm-ticket-acciones" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="adm-btn" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const TecnicoDashboard = () => {
  const { user, logout } = useAuth();
  const [soportes, setSoportes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [gestionando, setGestionando] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError('');
      const [s, e] = await Promise.all([
        soporteService.obtenerSoportes(user),
        soporteService.obtenerEstados(),
      ]);
      setSoportes(s);
      setEstados(e);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [user]);

  const resueltos = soportes.filter((s) => s.estado?.nombre === ESTADO_RESUELTO).length;
  const pendientes = soportes.length - resueltos;

  const visibles = useMemo(() => {
    if (filtro === 'pendientes') return soportes.filter((s) => s.estado?.nombre !== ESTADO_RESUELTO);
    if (filtro === 'resueltos') return soportes.filter((s) => s.estado?.nombre === ESTADO_RESUELTO);
    return soportes;
  }, [soportes, filtro]);

  return (
    <div className="adm-root">
      <header className="adm-glass adm-header adm-enter" style={{ '--i': 0 }}>
        <div>
          <h1>Mis soportes asignados</h1>
          <p>{user.nombre} · <span className="adm-pill">Técnico</span></p>
        </div>
        <div className="adm-actions">
          <button className="adm-btn adm-btn-ghost" onClick={cargar}>Actualizar</button>
          <button className="adm-btn adm-btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {gestionando && (
        <GestionSoporte
          ticket={gestionando}
          estados={estados}
          onCancel={() => setGestionando(null)}
          onSaved={() => { setGestionando(null); cargar(); }}
        />
      )}

      {loading && <p className="adm-status">Cargando...</p>}
      {error && <p className="adm-status adm-error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <Banner titulo="Tu jornada de soporte" texto="Atiende tus casos y deja cada diagnóstico registrado.">
            <TimelineIlustracion />
          </Banner>

          <section className="adm-stats">
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 1 }}>
              <span>Asignados</span><strong><CountUp value={soportes.length} /></strong>
            </div>
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 2 }}>
              <span>Pendientes</span><strong><CountUp value={pendientes} /></strong>
            </div>
            <div className="adm-glass adm-stat adm-enter" style={{ '--i': 3 }}>
              <span>Resueltos</span><strong><CountUp value={resueltos} /></strong>
            </div>
          </section>

          <div className="adm-tabs" style={{ marginTop: 20 }}>
            {[['todos', 'Todos'], ['pendientes', 'Pendientes'], ['resueltos', 'Resueltos']].map(([k, l]) => (
              <button key={k} className={`adm-tab ${filtro === k ? 'active' : ''}`} onClick={() => setFiltro(k)}>
                {l}
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <p className="adm-empty">No hay soportes en esta vista.</p>
          ) : (
            <div className="adm-cards">
              {visibles.map((s, i) => (
                <article key={s.id_ticket} className="adm-glass adm-ticket adm-enter" style={{ '--i': i % 8 }}>
                  <div className="adm-ticket-top">
                    <small>Ticket #{s.id_ticket}</small>
                    <span className={`adm-estado ${slug(s.estado?.nombre)}`}>{s.estado?.nombre}</span>
                  </div>
                  <h3>{s.categoria}</h3>
                  <p>{s.descripcion}</p>
                  {s.diagnostico && <p><small>Diagnóstico: {s.diagnostico}</small></p>}
                  <div className="adm-ticket-top">
                    <span className={`adm-prio ${slug(s.prioridad)}`}>{s.prioridad}</span>
                    <small>{s.equipo ? s.equipo.placa_inventario : 'Sin equipo'}</small>
                  </div>
                  <small>Solicitante: {nombreDePersona(s.solicitante)}</small>
                  {s.traslado_taller && <small>🔧 En taller</small>}
                  <div className="adm-ticket-acciones">
                    <button className="adm-btn" onClick={() => setGestionando(s)}>Gestionar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};