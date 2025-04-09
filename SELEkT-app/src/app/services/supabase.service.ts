import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {SUPABASE_URL, SUPABASE_KEY} from '../utils/config';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  async uploadAlbum(files: File[]): Promise<string | null> {
    try {
      /**
      // Obtener el usuario actual (asumiendo que usas Supabase Auth)
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      if (!user) {
        console.error('No hay usuario autenticado.');
        return null;
      }
        **/

      // Generar un código único para el álbum
      const albumCode = Math.random().toString(36).substring(7);
      const albumData = {
        code: albumCode,
        user_id: '8b504335-3181-4507-92c1-25a63345150b',
        created_at: new Date().toISOString(),
      };

      // Insertar el álbum en la tabla "Album"
      const { data: albumResponse, error: albumError } = await this.supabase
        .from('Album')
        .insert([albumData])
        .select()
        .single();

      if (albumError || !albumResponse) {
        console.error('Error creando el álbum:', albumError);
        return null;
      }

      // Subir cada foto y relacionarla con el álbum
      for (const file of files) {
        const filePath = `public/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } =
          await this.supabase.storage.from('Fotos').upload(filePath, file);

        if (uploadError || !uploadData) {
          console.error(`Error subiendo la foto ${file.name}:`, uploadError);
          continue;
        }

        // Obtener la URL pública de la foto
        const { data: urlData } = this.supabase.storage
          .from('Fotos')
          .getPublicUrl(uploadData.path);

        if (!urlData) {
          console.error(`Error obteniendo URL pública para ${file.name}:`);
          continue;
        }

        const publicURL = urlData.publicUrl;
        if (!publicURL) {
          console.error(`No se obtuvo URL para ${file.name}`);
          continue;
        }

        // Insertar registro en la tabla "Foto"
        const photoRecord = {
          album_id: albumResponse.id, // Relacionar con el álbum creado
          url: publicURL,
          nombre: file.name,
          fechaDeSubida: new Date().toISOString(),
        };

        const { error: photoError } = await this.supabase
          .from('Foto')
          .insert([photoRecord]);

        if (photoError) {
          console.error(`Error insertando foto ${file.name}:`, photoError);
        }
      }

      // Devolver el enlace para acceder al álbum.
      // Ajusta el dominio según tu despliegue en Netlify.
      const link = `https://https://selek-t-app.netlify.app/album/${albumCode}`;

      return link;
    } catch (error) {
      console.error('Error en uploadAlbum:', error);
      return null;
    }
  }

  async getPhotosByAlbumId(albumId: number): Promise<any[]> {
    try {
      const { data: photos, error } = await this.supabase
        .from('Foto')
        .select('*')
        .eq('album_id', albumId); // Filtrar fotos por album_id

      if (error) {
        console.error('Error obteniendo fotos:', error);
        return []; // Retorna un array vacío en caso de error
      }

      return photos; // Retorna las fotos obtenidas
    } catch (error) {
      console.error('Error en getPhotosByAlbumId:', error);
      return []; // Retorna un array vacío en caso de excepción
    }
  }

  async getAlbumByCode(albumCode: string): Promise<number | null> {
    try {
      const { data: album, error } = await this.supabase
        .from('Album')
        .select('id')
        .eq('code', albumCode)
        .single(); // Obtener un solo registro

      if (error || !album) {
        console.error('Error obteniendo el álbum:', error);
        return null; // Retorna null si hay un error o no se encuentra el álbum
      }

      return album.id; // Retorna el id del álbum
    } catch (error) {
      console.error('Error en getAlbumByCode:', error);
      return null; // Retorna null en caso de excepción
    }
  }

  async getUserAlbums(userId: String): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('Album')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error obteniendo los álbumes:', error);
      return [];
    }

    return data;
  }

  async deleteAlbum(albumId: number, albumCode: string): Promise<boolean> {
    try {
      // Obtener todas las fotos del álbum
      const { data: photos, error: photosError } = await this.supabase
        .from('Foto')
        .select('url')
        .eq('album_id', albumId);

      if (photosError) {
        console.error('Error obteniendo las fotos:', photosError);
        return false;
      }

      // Extraer los paths de los archivos en Supabase Storage, extraigo el path real, desde la url pública no deja supabase
      const filePaths = photos.map((photo) => {
        const urlParts = photo.url.split('/'); //divide la url en partes y lo mete en un Array
        return urlParts.slice(urlParts.indexOf('Fotos') + 1).join('/'); //Busca donde está Fotos y se mueve a +1, dentro de fotos, lo unimos con la / y así formamos el enlace
      });

      // Eliminar las fotos del bucket
      if (filePaths.length > 0) {
        const { error: deleteError } = await this.supabase.storage
          .from('Fotos')
          .remove(filePaths);

        if (deleteError) {
          console.error('Error eliminando fotos del bucket:', deleteError);
          return false;
        }
      }

      // Eliminar las fotos de la base de datos
      await this.supabase.from('Foto').delete().eq('album_id', albumId);

      // Eliminar el álbum de la base de datos
      await this.supabase.from('Album').delete().eq('id', albumId);

      return true;
    } catch (error) {
      console.error('Error inesperado al eliminar el álbum:', error);
      return false;
    }
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    const { data: session } = await this.supabase.auth.getSession();
    const email = session?.session?.user.email ?? '';

    // Re-autenticación usando email y current password
    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) return { error: signInError };

    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }

  //laura
  async uploadImageForAnalysis(
    base64: string,
    index: number
  ): Promise<{ fileName: string; url: string } | null> {
    try {
      const fileName = `image_${Date.now()}_${index}.jpg`;
      const base64Data = base64.split(',')[1];
      const binary = atob(base64Data);
      const buffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
      }

      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error || !data) {
        console.error(`Error subiendo la imagen ${index}:`, error);
        return null;
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      return {
        fileName,
        url: publicUrlData?.publicUrl ?? '',
      };
    } catch (err) {
      console.error('Error inesperado subiendo imagen:', err);
      return null;
    }
  }

  async clearAnalysisBucket(): Promise<void> {
    const { data, error } = await this.supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
      });

    if (error || !data) {
      console.error('Error listando imágenes en el bucket:', error);
      return;
    }

    const fileNames = data.map((file) => file.name);
    if (fileNames.length > 0) {
      const { error: deleteError } = await this.supabase.storage
        .from('images')
        .remove(fileNames);

      if (deleteError) {
        console.error('Error al borrar imágenes:', deleteError);
      }
    }
  }
}
