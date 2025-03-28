import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { MediatorService } from '../services/mediator.service'; // Importar MediatorService
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  selectedImages: { name: string; base64: string }[] = [];
  duplicateAlbum: any = null;
  similarAlbum: any = null;
  activeAlbum: string | null = null;
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
  processImages(): void {
    if (this.selectedImages.length === 0) {
      alert('Por favor, selecciona imágenes primero.');
      return;
    }

    this.isProcessing = true;
    const base64Images = this.selectedImages.map((img) => img.base64);

    this.photoService.processImages(base64Images).subscribe(
      (response) => {
        const albums = response.albums;
        this.duplicateAlbum = null;
        this.similarAlbum = null;

        this.displayDuplicateAlbum(albums);
        this.displaySimilarAlbum(albums);
        this.isProcessing = false;
        this.albumsLoaded = true;
      },
      (error) => {
        console.error('Error al procesar imágenes:', error);
        this.isProcessing = false;
      }
    );
  }

  displayDuplicateAlbum(albums: any): void {
    const duplicateAlbum = albums.find(
      (album: any) => album.name === 'Duplicados'
    );
    if (duplicateAlbum) {
      this.duplicateAlbum = duplicateAlbum;
      this.mediatorService.updateDuplicatePhotos(duplicateAlbum.photos); // Emitir fotos duplicadas
    }
  }

  displaySimilarAlbum(albums: any): void {
    const similarAlbum = albums.find(
      (album: any) => album.name === 'Similares'
    );
    if (similarAlbum) {
      this.similarAlbum = similarAlbum;
      this.mediatorService.updateSimilarPhotos(similarAlbum.photos); // Emitir fotos similares
    }
  }

  viewAlbum(albumType: string): void {
    if (albumType === 'duplicate') {
      this.activeAlbum = 'duplicate'; // Muestra el álbum de duplicados
      console.log('Fotos duplicadas a enviar: ', this.duplicateAlbum?.photos);
      this.whichAlbum = 'duplicate';
      this.mediatorService.setWhichAlbum(this.whichAlbum);
      this.router.navigate(['/manage/swiper'], {
        state: { albumType: 'duplicate', photos: this.duplicateAlbum?.photos },
      });
    } else if (albumType === 'similar') {
      this.whichAlbum = 'similar';
      this.mediatorService.setWhichAlbum(this.whichAlbum);
      this.activeAlbum = 'similar'; // Muestra el álbum de similares
      console.log('Fotos similares a enviar: ', this.similarAlbum?.photos);

      this.router.navigate(['/manage/swiper'], {
        state: { albumType: 'similar', photos: this.similarAlbum?.photos },
      });
    }
  }

  async showSimpleAlert() {
    console.log('trying');
    try {
      console.log('Creando la alerta...');
      const alert = await this.alertCtrl.create({
        header: 'Prueba',
        message: 'Esta es una alerta de prueba.',
        buttons: ['OK'],
      });
      console.log('Alert creada, presentando...');
      await alert.present();
      console.log('Alert presentada');
    } catch (error) {
      console.error('Error al mostrar la alerta:', error);
    }
  }
}
