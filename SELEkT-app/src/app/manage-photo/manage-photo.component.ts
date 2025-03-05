import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';
import { PhotoAlbum } from '../models/PhotoAlbum';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-manage-photo',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './manage-photo.component.html',
  styleUrls: ['./manage-photo.component.css'],
})
export class ManagePhotoComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  photoService = inject(PhotoLibraryService);

  // Álbum de duplicados y fotos de la galería
  duplicatedAlbum: any[] = []; // Álbum de duplicados
  galleryPhotos: string[] = []; // Galería con fotos para añadir a favoritos o eliminar
  selectedAlbum?: PhotoAlbum; // Álbum seleccionado
  selectedPhotos: string[] = []; // Fotos seleccionadas para el swiper
  selectedImages: any[] = [];
  albums: any[] = [];

  async ngOnInit() {
    // Suscribirse al observable para obtener las fotos de la galería y los álbumes duplicados
    this.photoService.getGalleryPhotos().subscribe((photos: string[]) => {
      this.galleryPhotos = photos;
      console.log('Galería cargada:', this.galleryPhotos);
    });

    this.photoService.getDuplicatedPhotos().subscribe((response: any) => {
      this.albums = response.albums;
      console.log('Álbumes de duplicados:', this.albums);
    });


    this.photoService
      .getDuplicatedPhotos()
      .subscribe((albums: PhotoAlbum[]) => {
        this.duplicatedAlbum = albums;
        console.log('Álbumes de duplicados:', this.duplicatedAlbum);
      });
  }

  // Método para seleccionar un álbum
  selectAlbum(album: PhotoAlbum) {
    this.selectedAlbum = album;
  }

  // Método para volver a la lista de álbumes
  goBack() {
    this.selectedAlbum = undefined;
  }

  // Método en el componente Angular para manejar la selección de archivos
  onFileSelected(event: any) {
    const files = event.target.files;
    this.selectedImages = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (e: any) => {
        this.selectedImages.push({
          name: files[i].name,
          base64: e.target.result,
        });
      };
    }
  }

  // Método para enviar las imágenes seleccionadas al backend
  submitImages() {
    const base64Images = this.selectedImages.map((image) => image.base64);

    this.photoService.processImages(base64Images).subscribe(
      (response) => {
        // Los álbumes se devuelven con moodboards y duplicados
        this.albums = response.albums;
      },
      (error) => {
        console.error('Error al procesar las imágenes', error);
      }
    );
  }
}
// import { Component, inject, OnInit } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
// import {
//   PhotoLibraryService,
//   PhotoAlbum,
// } from '../services/PhotoLibraryService';
// import { CommonModule } from '@angular/common';

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

//   selectedAlbum?: PhotoAlbum; // Álbum seleccionado
//   albums: PhotoAlbum[] = []; // Lista de álbumes

//   async ngOnInit() {
//     // Esperamos la carga de los álbumes
//     this.albums = await this.photoService.getPhotoAlbums();
//     console.log('Álbumes cargados:', this.albums); // Para depuración
//   }

//   // Método para seleccionar un álbum
//   selectAlbum(album: PhotoAlbum) {
//     this.selectedAlbum = album;
//   }

//   // Método para volver a la lista de álbumes
//   goBack() {
//     this.selectedAlbum = undefined;
//   }
// }
