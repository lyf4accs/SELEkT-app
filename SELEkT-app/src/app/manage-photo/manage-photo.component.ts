// import { Component, inject, OnInit } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
// import { PhotoLibraryService } from '../services/PhotoLibraryService';
// import { CommonModule } from '@angular/common';
// import { PhotoAlbum } from '../models/PhotoAlbum';

// @Component({
//   selector: 'app-manage-photo',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './manage-photo.component.html',
//   styleUrls: ['./manage-photo.component.css'],
// })
// export class ManagePhotoComponent implements OnInit {
//   cdr = inject(ChangeDetectorRef);
//   photoService = inject(PhotoLibraryService);

//   // Álbum de duplicados y fotos de la galería
//   duplicatedAlbum: PhotoAlbum[] = []; // Álbum con fotos duplicadas
//   galleryPhotos: string[] = []; // Galería con fotos para añadir a favoritos o eliminar
//   selectedAlbum?: PhotoAlbum; // Álbum seleccionado
//   selectedPhotos: string[] = []; // Fotos seleccionadas para el swiper

//   async ngOnInit() {
//     // Suscribirse al observable para obtener las fotos de la galería y los álbumes duplicados
//     this.photoService.getGalleryPhotos().subscribe((photos: string[]) => {
//       this.galleryPhotos = photos;
//       console.log('Galería cargada:', this.galleryPhotos);
//     });

//     this.photoService
//       .getDuplicatedPhotos()
//       .subscribe((albums: PhotoAlbum[]) => {
//         this.duplicatedAlbum = albums;
//         console.log('Álbumes de duplicados:', this.duplicatedAlbum);
//       });
//   }

//   // Método para seleccionar un álbum
//   selectAlbum(album: PhotoAlbum) {
//     this.selectedAlbum = album;
//   }

//   // Método para volver a la lista de álbumes
//   goBack() {
//     this.selectedAlbum = undefined;
//   }

//   // Método para seleccionar una foto y añadirla al swiper
//   selectPhoto(photo: string) {
//     if (!this.selectedPhotos.includes(photo)) {
//       this.selectedPhotos.push(photo);
//     }
//   }

//   // Método para deseleccionar una foto
//   deselectPhoto(photo: string) {
//     this.selectedPhotos = this.selectedPhotos.filter((p) => p !== photo);
//   }

//   // Métodos para gestionar fotos (añadir a favoritos o eliminar)
//   addToFavorites(photo: string) {
//     console.log('Añadir a favoritos:', photo);
//   }

//   deletePhoto(photo: string) {
//     console.log('Eliminar foto:', photo);
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {
  PhotoLibraryService,
  PhotoAlbum,
} from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-photo.component.html',
  styleUrls: ['./manage-photo.component.css'],
})
export class ManagePhotoComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  photoService = inject(PhotoLibraryService);

  selectedAlbum?: PhotoAlbum; // Álbum seleccionado
  albums: PhotoAlbum[] = []; // Lista de álbumes

  async ngOnInit() {
    // Esperamos la carga de los álbumes
    this.albums = await this.photoService.getPhotoAlbums();
    console.log('Álbumes cargados:', this.albums); // Para depuración
  }

  // Método para seleccionar un álbum
  selectAlbum(album: PhotoAlbum) {
    this.selectedAlbum = album;
  }

  // Método para volver a la lista de álbumes
  goBack() {
    this.selectedAlbum = undefined;
  }
}
