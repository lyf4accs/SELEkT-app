import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  constructor() {}

  async getPhoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Prompt, // Esto abrirá el selector para elegir entre la cámara y la galería
        resultType: CameraResultType.Uri, // Puedes obtener la foto en formato URI
      });

      // Verifica si image.webPath está definido, si no, asigna un valor predeterminado
      const webPath = image.webPath ?? ''; // Usamos el operador de coalescencia nula (??)

      console.log('Imagen seleccionada:', webPath);
      return webPath;
    } catch (error) {
      console.error('Error al obtener la foto:', error);
      return ''; // Retorna una cadena vacía en caso de error
    }
  }
}
