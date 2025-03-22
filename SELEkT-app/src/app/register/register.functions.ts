import { supabaseClient } from '../utils/supabase_client';


export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
): Promise<void> {
  const userData = {
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: 'https://selek-t-app.netlify.app/login',
    },
  };
  try {
    const { data, error } = await supabaseClient.auth.signUp(userData);
    if (error) {
      if (String(error).includes('key')) throw 'Correo a registrado';
      throw error;
    }
    console.log('Usuario registrado con éxito');
  } catch (error) {
    console.error('Error inesperado:', (error as Error).message);
    throw error;
  }
}

export async function validarCorreoElectronico(correo: string): Promise<boolean> {
  console.log('validando email');
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !expresionRegular.test(correo);
}
export async function camposVacios(email: string, password: string): Promise<boolean> {
  console.log('validando email');
  return email.trim() === '' || password.trim() === '';
}
export async function validarNombre(texto: string): Promise<boolean> {
  const contieneDigitos = /\d/.test(texto);
  const masDe100Caracteres = texto.length > 50;
  return contieneDigitos || masDe100Caracteres;
}

export async function validarContrasena(password: string, rep: string): Promise<boolean> {
  const contrasenaInvalida = password === rep;
  return !contrasenaInvalida;
}
export async function validarLongitudContrasena(password: string): Promise<boolean> {
  const longitudValida = password.length >= 8 && password.length <= 16;
  return !longitudValida;
}
