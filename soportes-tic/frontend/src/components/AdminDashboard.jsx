import React, { useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/adminService';
import { soporteService } from '../services/soporteService';
import { useAuth } from '../context/AuthContext';
import { SoporteForm } from './SoporteForm';
import { ROLES, ESTADO_RESUELTO } from '../config/constants';
import { CountUp, Banner, BarrasChart, DonaChart, AreaChart } from './DashUI';
import { DashboardIlustracion } from './Ilustraciones';
import './AdminDashboard.css';
import './Portales.css';

const slug = (t = '') =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

const nombreDePersona = (p) =>
  p ? `${p.primer_nombre ?? ''} ${p.primer_apellido ?? ''}`.trim() : 'Sin asignar';

const PALETA = ['#0a84ff', '#64d2ff', '#30d158', '#ffb340', '#bf5af2', '#ff453a'];
const COLOR_PRIO = { 'Crítica': '#ff453a', 'Urgente': '#ff453a', 'Alta': '#ffb340', 'Media': '#64d2ff', 'Baja': '#30d158' };

const mismoDia = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [soportes, setSoportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      setError('');
      const [u, s] = await Promise.all([
        adminService.obtenerUsuarios(),
        soporteService.obtenerSoportes(user),
      ]);
      setUsuarios(u);
      setSoportes(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [user]);

  const tecnicos = useMemo(() => usuarios.filter((u) => u.rol === ROLES.TECNICO), [usuarios]);

  const asignar = async (ticket, idTecnico) => {
    const tecnico = tecnicos.find((t) => String(t.id_usuario) === idTecnico) ?? null;
    try {
      await soporteService.asignarTecnico(ticket, tecnico, user);
      cargar();
    } catch (err) {
      alert('Error al asignar: ' + err.message);
    }
  };

  const resueltos = soportes.filter((s) => s.estado?.nombre === ESTADO_RESUELTO).length;
  const sinResolver = soportes.length - resueltos;

  const stats = [
    { label: 'Usuarios', value: usuarios.length },
    { label: 'Técnicos', value: tecnicos.length },
    { label: 'Soportes', value: soportes.length },
    { label: 'Sin resolver', value: sinResolver },
    { label: 'Resueltos', value: resueltos },
  ];

  const porEstado = useMemo(() => {
    const conteo = {};
    soportes.forEach((s) => {
      const n = s.estado?.nombre ?? 'Sin estado';
      conteo[n] = (conteo[n] || 0) + 1;
    });
    return Object.entries(conteo).map(([label, value], i) => ({ label, value, color: PALETA[i % PALETA.length] }));
  }, [soportes]);

  const porPrioridad = useMemo(() => {
    const conteo = {};
    soportes.forEach((s) => {
      const n = s.prioridad ?? 'Sin prioridad';
      conteo[n] = (conteo[n] || 0) + 1;
    });
    return Object.entries(conteo).map(([label, value]) => ({
      label, value, color: COLOR_PRIO[label] ?? '#8e8e93',
    }));
  }, [soportes]);

  const porDia = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    return {
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      value: soportes.filter((s) => s.fecha_creacion && mismoDia(new Date(s.fecha_creacion), d)).length,
    };
  }), [soportes]);

  const cargaTecnicos = useMemo(() => tecnicos.map((t) => {
    const mios = soportes.filter((s) => s.id_tecnicosoporte === t.id_usuario);
    return {
      ...t,
      total: mios.length,
      resueltos: mios.filter((s) => s.estado?.nombre === ESTADO_RESUELTO).length,
    };
  }), [tecnicos, soportes]);

  const cargaChart = cargaTecnicos.map((t, i) => ({
    label: (t.nombre.split(' ')[0] || 'Técnico').slice(0, 9),
    value: t.total,
    color: PALETA[i % PALETA.length],
  }));

  const texto = busqueda.toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(texto) ||
    (u.email || '').toLowerCase().includes(texto) ||
    (u.documento || '').includes(texto) ||
    u.rol.toLowerCase().includes(texto)
  );

  return (
    <div className="adm-root">
      <header className="adm-glass adm-header adm-enter" style={{ '--i': 0 }}>
        <div>
          <h1>Panel de Administración</h1>
          <p>{user.nombre} · <span className="adm-pill">{user.rol}</span></p>
        </div>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => setShowForm(true)}>+ Registrar soporte</button>
          <button className="adm-btn adm-btn-ghost" onClick={cargar}>Actualizar</button>
          <button className="adm-btn adm-btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      {showForm && (
        <SoporteForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); cargar(); }}
        />
      )}

      {loading && <p className="adm-status">Cargando datos...</p>}
      {error && <p className="adm-status adm-error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <Banner titulo="Vista general" texto="Todo el sistema de soporte, en tiempo real.">
            <DashboardIlustracion />
          </Banner>

          <section className="adm-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="adm-glass adm-stat adm-enter" style={{ '--i': i + 1 }}>
                <span>{s.label}</span>
                <strong><CountUp value={s.value} /></strong>
              </div>
            ))}
          </section>

          <section className="adm-grid-2">
            <div className="adm-glass adm-enter" style={{ '--i': 6 }}>
              <h2>Estados de solicitudes</h2>
              {porEstado.length ? (
                <DonaChart datos={porEstado} centro={{ valor: soportes.length, texto: 'Total' }} />
              ) : <p>Sin datos.</p>}
            </div>
            <div className="adm-glass adm-enter" style={{ '--i': 7 }}>
              <h2>Solicitudes últimos 14 días</h2>
              <AreaChart datos={porDia} />
            </div>
          </section>

          <section className="adm-grid-2">
            <div className="adm-glass adm-enter" style={{ '--i': 8 }}>
              <h2>Carga por técnico</h2>
              {cargaChart.length ? <BarrasChart datos={cargaChart} /> : <p>No hay técnicos registrados.</p>}
            </div>
            <div className="adm-glass adm-enter" style={{ '--i': 9 }}>
              <h2>Prioridades</h2>
              {porPrioridad.length ? <BarrasChart datos={porPrioridad} /> : <p>Sin datos.</p>}
            </div>
          </section>

          <section className="adm-glass adm-block adm-enter" style={{ '--i': 10 }}>
            <div className="adm-block-head">
              <h2>Usuarios del sistema ({usuariosFiltrados.length})</h2>
              <input
                className="adm-search"
                placeholder="Buscar por nombre, correo, documento o rol"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Documento</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id_usuario}>
                      <td>{u.documento}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td>{u.estado_cuenta ? 'Activa' : 'Inactiva'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="adm-glass adm-block adm-enter" style={{ '--i': 11 }}>
            <h2>Solicitudes de soporte ({soportes.length})</h2>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Ticket</th><th>Fecha</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Equipo</th><th>Solicitante</th><th>Técnico</th></tr>
                </thead>
                <tbody>
                  {soportes.map((s) => (
                    <tr key={s.id_ticket}>
                      <td>#{s.id_ticket}</td>
                      <td>{s.fecha_creacion ? new Date(s.fecha_creacion).toLocaleDateString() : '-'}</td>
                      <td>{s.categoria}</td>
                      <td><span className={`adm-prio ${slug(s.prioridad)}`}>{s.prioridad}</span></td>
                      <td>{s.estado?.nombre}</td>
                      <td>{s.equipo ? s.equipo.placa_inventario : '-'}</td>
                      <td>{nombreDePersona(s.solicitante)}</td>
                      <td>
                        <select
                          className="adm-input"
                          style={{ marginTop: 0, minWidth: 180, padding: '6px 10px' }}
                          value={s.id_tecnicosoporte ?? ''}
                          onChange={(e) => asignar(s, e.target.value)}
                        >
                          <option value="">Sin asignar</option>
                          {tecnicos.map((t) => (
                            <option key={t.id_usuario} value={t.id_usuario}>{t.nombre}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};