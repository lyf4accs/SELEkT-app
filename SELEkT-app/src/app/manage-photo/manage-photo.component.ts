import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { MediatorService } from '../services/mediator.service'; // Importar MediatorService
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { SUPABASE_URL } from '../utils/config';

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
  mediatorService = inject(MediatorService);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  supabaseService = inject(SupabaseService);

  selectedImages: { name: string; base64: string }[] = [];
  duplicateAlbums: any[] = [];
  similarAlbums: any[] = [];
  isProcessing: boolean = false;
  albumsLoaded: boolean = false;
  whichAlbum: string | undefined = undefined;

  ngOnInit(): void {
    this.whichAlbum = undefined;
  }
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
        this.cdr.detectChanges();
      };
    }
  }

  // Enviar imágenes al servidor para detectar duplicados y similares
   async processImages(): Promise<void> {
    if (this.selectedImages.length === 0) {
      alert('Por favor, selecciona imágenes primero.');
      return;
    }

    this.isProcessing = true;
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < this.selectedImages.length; i++) {
        const img = this.selectedImages[i];
        const base64 = img.base64.split(',')[1];
        const fileName = `img_${Date.now()}_${i}.jpg`;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let j = 0; j < byteCharacters.length; j++) {
          byteNumbers[j] = byteCharacters.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const publicUrl = await this.supabaseService.uploadImage(fileName, blob);
        uploadedUrls.push(publicUrl);
      }

      // Ahora enviar las URLs al backend para procesamiento de duplicados y similares
      this.photoService.processImages(uploadedUrls).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta
          const albums = response.albums;
          this.duplicateAlbums = albums.filter((a: any) =>
            a.name.includes('Duplicados')
          );
          this.similarAlbums = albums.filter((a: any) =>
            a.name.includes('Similares')
          );
          this.isProcessing = false;
        },
        (error) => {
          console.error('Error al procesar imágenes:', error);
          this.isProcessing = false;
        }
      );

    } catch (err) {
      console.error('Error subiendo imágenes:', err);
      this.isProcessing = false;
    }
  }


  viewAlbum(albumType: string, albumIndex?: number): void {
    if (albumType === 'duplicate') {
      this.whichAlbum = 'duplicate';
      this.mediatorService.setWhichAlbum(this.whichAlbum);
      const album = this.duplicateAlbums[albumIndex || 0];
      this.mediatorService.updateDuplicatePhotos(album.photos); // Solo fotos del álbum seleccionado
    } else if (albumType === 'similar' && albumIndex !== undefined) {
      this.whichAlbum = 'similar';
      this.mediatorService.setWhichAlbum(this.whichAlbum);
      const album = this.similarAlbums[albumIndex];
      this.mediatorService.updateSimilarPhotos(album.photos); // Solo fotos del álbum seleccionado
    }
    this.duplicateAlbums.forEach((album) => {
      if (album.photos.length > 0) {
        album.coverPhoto = album.photos[0]; // Primera imagen como cover
      }
    });

    this.similarAlbums.forEach((album) => {
      if (album.photos.length > 0) {
        album.coverPhoto = album.photos[0];
      }
    });

    this.router.navigate(['/manage/swiper']);
  }
}
