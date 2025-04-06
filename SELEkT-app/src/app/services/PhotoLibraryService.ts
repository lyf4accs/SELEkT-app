import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  private apiUrl = environment.apiUrl; // Asegúrate de que esta URL esté configurada correctamente

  constructor(private http: HttpClient) {}

  // Subir imágenes al backend
  uploadImages(images: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, { images });
  }

  // Procesar imágenes una vez subidas
  processImages(imageUrls: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, { imageUrls });
  }

  // Función principal para manejar el flujo completo (subir y luego procesar)
  handleImages(images: string[]): Observable<any> {
    return new Observable((observer) => {
      // Primero subimos las imágenes
      this.uploadImages(images).subscribe(
        (uploadResponse) => {
          if (uploadResponse && uploadResponse.imageUrls) {
            const imageUrls = uploadResponse.imageUrls; // Obtenemos las URLs de las imágenes subidas

            // Luego procesamos las imágenes usando esas URLs
            this.processImages(imageUrls).subscribe(
              (processResponse) => {
                observer.next(processResponse); // Emitimos la respuesta del procesamiento
                observer.complete();
              },
              (processError) => {
                observer.error(processError); // En caso de error en el procesamiento
              }
            );
          } else {
            observer.error('Error subiendo imágenes');
          }
        },
        (uploadError) => {
          observer.error(uploadError); // En caso de error en la subida
        }
      );
    });
  }
}
