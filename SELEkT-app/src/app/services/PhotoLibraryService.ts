import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  private apiUrl = '/api'; // Usar el proxy en lugar de la URL absoluta

  constructor(private http: HttpClient) {}

  // Método para obtener los moodboards generados
  getMoodboards(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getMoodboards`);
  }

  // Método para procesar las imágenes y agruparlas en moodboards
  processImages(images: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/processImages`, { images });
  }

  // Método para obtener la lista de fotos duplicadas
  getDuplicatedPhotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getDuplicatedPhotos`);
  }

  // Método para obtener las fotos de la galería del usuario
  getGalleryPhotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getGalleryPhotos`);
  }

  createMoodboard(moodboard: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createMoodboard`, moodboard);
  }

  addImagesToMoodboard(moodboardId: string, images: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addImagesToMoodboard`, {
      moodboardId,
      images,
    });
  }
}
// import { Injectable } from '@angular/core';

// export interface PhotoAlbum {
//   name: string;
//   coverPhoto: string;
//   photos: string[];
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class PhotoLibraryService {
//   constructor() {}

//   // Método para obtener los álbumes
//   async getPhotoAlbums(): Promise<PhotoAlbum[]> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           {
//             name: 'B&W',
//             coverPhoto: 'assets/googoodolls.jpg',
//             photos: [
//               'assets/googoodolls.jpg',
//               'assets/IMG_1379.jpg',
//               'assets/IMG_1380.jpg',
//             ],
//           },
//           {
//             name: 'Ingredientes',
//             coverPhoto: 'assets/pat.jpg',
//             photos: ['assets/pat.jpg', 'assets/manzana.jpg'],
//           },
//         ]);
//       }, 1000); // Simula un retraso de 1 segundo en la carga
//     });
//   }
// }
