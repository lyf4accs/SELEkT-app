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
      // Obtener el usuario actual (asumiendo que usas Supabase Auth)
      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      if (!user) {
        console.error('No hay usuario autenticado.');
        return null;
      }

      // Generar un código único para el álbum
      const albumCode = Math.random().toString(36).substring(7);
      const albumData = {
        code: albumCode,
        usuario_id: user.id, // Asociar el álbum al usuario autenticado
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
          await this.supabase.storage.from('Foto').upload(filePath, file);

        if (uploadError || !uploadData) {
          console.error(`Error subiendo la foto ${file.name}:`, uploadError);
          continue;
        }

        // Obtener la URL pública de la foto
        const { data: urlData } = this.supabase.storage
          .from('Foto')
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
      return `https://tusitio.netlify.app/album/${albumCode}`;
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
}
