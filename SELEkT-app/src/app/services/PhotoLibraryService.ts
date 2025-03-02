import { Injectable } from '@angular/core';

export interface PhotoAlbum {
  name: string;
  coverPhoto: string;
  photos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  constructor() {}

  // Método para obtener los álbumes
  async getPhotoAlbums(): Promise<PhotoAlbum[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            name: 'B&W',
            coverPhoto: 'assets/googoodolls.jpg',
            photos: [
              'assets/googoodolls.jpg',
              'assets/IMG_1379.jpg',
              'assets/IMG_1380.jpg',
            ],
          },
          {
            name: 'Ingredientes',
            coverPhoto: 'assets/pat.jpg',
            photos: ['assets/pat.jpg', 'assets/manzana.jpg'],
          },
        ]);
      }, 1000); // Simula un retraso de 1 segundo en la carga
    });
  }
}
