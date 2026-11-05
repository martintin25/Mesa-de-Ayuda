import { supabase } from '../api/supabaseClient';

export const historialService = {
  async obtenerHistorial(idTicket) {
    const { data, error } = await supabase
      .from('historial_solicitud')
      .select('fecha_registro, comentario, usuario:usuarios_sistema!id_usuario(primer_nombre, primer_apellido)')
      .eq('id_ticket', idTicket)
      .order('fecha_registro', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },
};