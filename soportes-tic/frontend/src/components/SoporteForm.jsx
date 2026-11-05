import React, { useState, useEffect } from 'react';
import { soporteService } from '../services/soporteService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ESTADO_INICIAL, PRIORIDADES, CATEGORIAS } from '../config/constants';

export const SoporteForm = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [prioridad, setPrioridad] = useState('Media');
  const [idEquipo, setIdEquipo] = useState('');
  const [idTecnico, setIdTecnico] = useState('');
  const [tecnicos, setTecnicos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    authService.obtenerTecnicos().then(setTecnicos).catch(() => console.error('Error al cargar técnicos'));
    soporteService.obtenerEquipos().then(setEquipos).catch(() => console.error('Error al cargar equipos'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const estados = await soporteService.obtenerEstados();
      const estadoInicial = estados.find((x) => x.nombre === ESTADO_INICIAL);
      if (!estadoInicial) throw new Error(`No existe el estado "${ESTADO_INICIAL}"`);

      await soporteService.crearSoporte({
        descripcion,
        categoria,
        prioridad,
        id_equipo: idEquipo ? Number(idEquipo) : null,
        id_tecnicosoporte: idTecnico ? Number(idTecnico) : null,
        id_solicitante: user.id_usuario,
        id_estado: estadoInicial.id_estado,
        fecha_creacion: new Date().toISOString(),
      });
      onSuccess();
    } catch (err) {
      alert('Error al registrar el soporte: ' + err.message);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-container">
        <h3>Registrar Nueva Solicitud de Soporte</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descripción del problema:</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows="3" required />
          </div>
          <div className="form-group">
            <label>Categoría:</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select value={prioridad} onChange={e => setPrioridad(e.target.value)}>
              {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Equipo (opcional):</label>
            <select value={idEquipo} onChange={e => setIdEquipo(e.target.value)}>
              <option value="">-- Seleccione un equipo --</option>
              {equipos.map(eq => (
                <option key={eq.id_equipo} value={eq.id_equipo}>
                  {eq.placa_inventario} {eq.marca ? `- ${eq.marca}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Asignar a Técnico:</label>
            <select value={idTecnico} onChange={e => setIdTecnico(e.target.value)}>
              <option value="">-- Seleccione un técnico --</option>
              {tecnicos.map(t => <option key={t.id_usuario} value={t.id_usuario}>{t.nombre}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-success">Guardar Solicitud</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
