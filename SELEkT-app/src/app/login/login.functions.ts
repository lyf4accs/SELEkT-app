import { supabaseClient } from '../utils/supabase_client';

export async function signInUser(
  email: string,
  password: string
): Promise<boolean> {
  const signInInfo = {
    email,
    password,
  };

  try {
    if (await camposVacios(email, password)) {
      console.error('Rellena todos los campos');
      return false; // Devolvemos false si hay campos vacíos
    }
    if (await validarCorreoElectronico(email)) {
      console.error('Email incorrecto. Escribe un email válido');
      return false; // Devolvemos false si el correo no es válido
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword(
      signInInfo
    );
    if (error) {
      console.error('Email o contraseña incorrecto/s');
      return false; // Devolvemos false si hay error de autenticación
    }
    console.log('Éxito iniciando sesión', data.user);
    return true; // Devuelve true en caso de éxito
  } catch (error) {
    console.error('Error inesperado:', (error as Error).message);
    return false; // Si ocurre un error inesperado, devolvemos false
  }
}

function validarCorreoElectronico(correo: string): boolean {
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !expresionRegular.test(correo);
}

function camposVacios(email: string, password: string): boolean {
  return email.trim() === '' || password.trim() === '';
}


export async function isUser(email: string): Promise<Boolean> {
  console.log('haciendo ahora isUser')
  try {
    const { data, error, count } = await supabaseClient
      .from('users_info')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if (error) throw 'Error al comprobar la existencia del correo';
    console.log(count);
    return count ? true : false;
  } catch (error) {
    console.error('Error inesperado: ', error);
    throw error;
  }
}
