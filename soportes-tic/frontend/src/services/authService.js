import { supabase } from '../api/supabaseClient';
import { ROLES } from '../config/constants';

// Campos de usuarios_sistema + nombre del rol (relación id_rol -> roles_usuario)
const CAMPOS_USUARIO = 'id_usuario, documento, email, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_rol, id_ficha, id_especialidad, roles_usuario(nombre)';

// Une los campos de nombre en un solo texto y expone el rol como texto
const normalizarUsuario = (u) => ({
  ...u,
  nombre: [u.primer_nombre, u.segundo_nombre, u.primer_apellido, u.segundo_apellido]
    .filter(Boolean)
    .join(' '),
  rol: u.roles_usuario?.nombre ?? null,
});

export const authService = {
  async obtenerRoles() {
    const { data, error } = await supabase
      .from('roles_usuario')
      .select('id_rol, nombre')
      .order('id_rol');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async registrarUsuario(datos) {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .insert([datos])
      .select(CAMPOS_USUARIO);
    if (error) throw new Error(error.message);
    return normalizarUsuario(data[0]);
  },

  async login(email, password) {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select(CAMPOS_USUARIO)
      .eq('email', email)
      .eq('password', password)
      .eq('estado_cuenta', true)
      .maybeSingle();
    if (error || !data) throw new Error('Credenciales inválidas');
    return normalizarUsuario(data);
  },

  async obtenerTecnicos() {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, roles_usuario!inner(nombre)')
      .eq('roles_usuario.nombre', ROLES.TECNICO);
    if (error) throw new Error(error.message);
    return (data || []).map(normalizarUsuario);
  },
};
