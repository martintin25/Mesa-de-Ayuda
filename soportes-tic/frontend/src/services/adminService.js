import { supabase } from '../api/supabaseClient';

export const adminService = {
  async obtenerUsuarios() {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('id_usuario, documento, email, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, estado_cuenta, roles_usuario(nombre)')
      .order('id_usuario');
    if (error) throw new Error(error.message);

    return (data || []).map((u) => ({
      ...u,
      nombre: [u.primer_nombre, u.segundo_nombre, u.primer_apellido, u.segundo_apellido]
        .filter(Boolean)
        .join(' '),
      rol: u.roles_usuario?.nombre ?? 'Sin rol',
    }));
  },
};