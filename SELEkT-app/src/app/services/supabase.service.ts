import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {SUPABASE_URL, SUPABASE_KEY} from '../utils/config';




@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient | undefined;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async uploadFile(file: File): Promise<string | null> {
    const { data, error }: UploadResponse = await this.supabase.storage
      .from('fotos')
      .upload('public/' + file.name, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Obtener la URL pública del archivo
    const { publicURL, error: urlError } = this.supabase.storage
      .from('fotos')
      .getPublicUrl(data?.path);

    if (urlError || !publicURL) {
      console.error('Error getting file URL:', urlError);
      return null;
    }

    return publicURL; // URL de acceso a la foto
  }

  async createLink(fotosUrls: string[]): Promise<string | null> {
    const enlace = {
      enlace: `https://miapp.com/enlace/${Math.random()
        .toString(36)
        .substring(7)}`,
      fecha_creacion: new Date().toISOString(),
    };

    const { data, error }: CreateLinkResponse = await this.supabase
      .from('enlaces')
      .insert([enlace]);

    if (error) {
      console.error('Error creating link:', error);
      return null;
    }

    return data?.[0]?.enlace || null; // Devuelve el enlace generado o null si no está definido
  }
}
