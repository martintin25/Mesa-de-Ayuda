import { supabase } from '../api/supabaseClient';
import { ROLES, ESTADO_RESUELTO } from '../config/constants';

// Columnas de solicitudes_soporte + datos relacionados (FKs)
const CAMPOS_SOPORTE = 'id_ticket, fecha_creacion, fecha_cierre, descripcion, diagnostico, prioridad, categoria, traslado_taller, calificacion, id_estado, id_equipo, id_solicitante, id_tecnicosoporte, estado:estados_solicitud(id_estado, nombre), equipo:equipos_computo!id_equipo(placa_inventario, marca), solicitante:usuarios_sistema!id_solicitante(primer_nombre, primer_apellido), tecnico:usuarios_sistema!id_tecnicosoporte(primer_nombre, primer_apellido)';

export const soporteService = {
    async obtenerSoportes(user) {
    let query = supabase
      .from('solicitudes_soporte')
      .select(CAMPOS_SOPORTE)
      .order('fecha_creacion', { ascending: false });

    if (user.rol === ROLES.TECNICO) {
      query = query.eq('id_tecnicosoporte', user.id_usuario);
    } else if (user.rol === ROLES.SOLICITANTE) {
      query = query.eq('id_solicitante', user.id_usuario);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },
    async asignarTecnico(ticket, tecnico, usuario) {
    const { error } = await supabase
      .from('solicitudes_soporte')
      .update({ id_tecnicosoporte: tecnico?.id_usuario ?? null })
      .eq('id_ticket', ticket.id_ticket);
    if (error) throw new Error(error.message);

    const { error: errHist } = await supabase.from('historial_solicitud').insert([{
      id_ticket: ticket.id_ticket,
      id_usuario: usuario.id_usuario,
      comentario: tecnico
        ? `Ticket asignado a ${tecnico.nombre}`
        : 'Se quitó la asignación del técnico',
      fecha_registro: new Date().toISOString(),
    }]);
    if (errHist) console.warn('No se pudo registrar el historial:', errHist.message);
  },
     async actualizarSoporte(ticket, nuevoEstado, datos, usuario) {
    const cambios = {
      id_estado: nuevoEstado.id_estado,
      diagnostico: datos.diagnostico,
      traslado_taller: datos.traslado_taller,
      fecha_cierre: nuevoEstado.nombre === ESTADO_RESUELTO ? new Date().toISOString() : null,
    };
    const { error } = await supabase
      .from('solicitudes_soporte')
      .update(cambios)
      .eq('id_ticket', ticket.id_ticket);
    if (error) throw new Error(error.message);

    const partes = [];
    if (nuevoEstado.id_estado !== ticket.id_estado) {
      partes.push(`Estado: "${ticket.estado?.nombre}" → "${nuevoEstado.nombre}"`);
    }
    if (datos.traslado_taller !== !!ticket.traslado_taller) {
      partes.push(datos.traslado_taller ? 'Equipo trasladado al taller' : 'Traslado al taller cancelado');
    }
    if (datos.diagnostico && datos.diagnostico !== (ticket.diagnostico ?? '')) {
      partes.push(`Diagnóstico: ${datos.diagnostico}`);
    }

    if (partes.length > 0) {
      const { error: errHist } = await supabase.from('historial_solicitud').insert([{
        id_ticket: ticket.id_ticket,
        id_usuario: usuario.id_usuario,
        comentario: partes.join(' — '),
        fecha_registro: new Date().toISOString(),
      }]);
      if (errHist) console.warn('No se pudo registrar el historial:', errHist.message);
    }
  },

  async crearSoporte(datos) {
    const { data, error } = await supabase
      .from('solicitudes_soporte')
      .insert([datos])
      .select(CAMPOS_SOPORTE);
    if (error) throw new Error(error.message);
    return data[0];
  },

  async obtenerEstados() {
    const { data, error } = await supabase
      .from('estados_solicitud')
      .select('id_estado, nombre')
      .order('id_estado');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async obtenerEquipos() {
    const { data, error } = await supabase
      .from('equipos_computo')
      .select('id_equipo, placa_inventario, marca')
      .order('id_equipo');
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Cambia el estado del ticket y deja registro en historial_solicitud
  async cambiarEstado(ticket, nuevoEstado, usuario) {
    const cambios = { id_estado: nuevoEstado.id_estado };
    if (nuevoEstado.nombre === ESTADO_RESUELTO) {
      cambios.fecha_cierre = new Date().toISOString();
    }

    const { error } = await supabase
      .from('solicitudes_soporte')
      .update(cambios)
      .eq('id_ticket', ticket.id_ticket);
    if (error) throw new Error(error.message);

    const { error: errHist } = await supabase.from('historial_solicitud').insert([{
      id_ticket: ticket.id_ticket,
      id_usuario: usuario.id_usuario,
      comentario: `Estado cambiado de "${ticket.estado?.nombre}" a "${nuevoEstado.nombre}"`,
      fecha_registro: new Date().toISOString(),
    }]);
    if (errHist) console.warn('No se pudo registrar el historial:', errHist.message);
  },
};
