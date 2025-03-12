import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';
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
  selectedImages: { name: string; base64: string }[] = [];
  duplicateAlbum: any = null;
  isAlbumView: boolean = false; // To toggle between album view and photo view

  ngOnInit(): void {}

  // Método para seleccionar imágenes desde la galería
  getGalleryPhotos(event: any): void {
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
        this.cdr.detectChanges(); // Forzar actualización de la vista
      };
    }
  }

  // Enviar imágenes al servidor para detectar duplicados
  processImages(): void {
    if (this.selectedImages.length === 0) {
      alert('Por favor, selecciona imágenes primero.');
      return;
    }

    const base64Images = this.selectedImages.map((img) => img.base64);

    this.photoService.processImages(base64Images).subscribe(
      (response) => {
        const albums = response.albums;
        this.displayDuplicateAlbum(albums);

      },
      (error) => {
        console.error('Error al procesar imágenes:', error);
      }
    );
  }

  // Mostrar el álbum de duplicados en la interfaz
  displayDuplicateAlbum(albums: any): void {
    const duplicateAlbum = albums.find(
      (album: any) => album.name === 'Duplicados'
    );
    if (duplicateAlbum) {
      this.duplicateAlbum = duplicateAlbum;
    }

  }

  // Toggle view between album and photo view
  toggleAlbumView(): void {
    this.isAlbumView = !this.isAlbumView;
  }
}
