import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { MediatorService } from '../services/mediator.service'; // Importar MediatorService
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

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
    const duplicates = this.mediatorService.getDuplicatePhotos();
    const similars = this.mediatorService.getSimilarPhotos();

    if (duplicates.length > 0 || similars.length > 0) {
      this.duplicateAlbums = [{ name: 'Duplicados', photos: duplicates }];
      this.similarAlbums = [{ name: 'Similares', photos: similars }];
      this.albumsLoaded = true;
    }
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
    this.supabaseService.clearAnalysisBucket().then(() => {
      Promise.all(
        base64Images.map((base64, i) =>
          this.supabaseService.uploadImageForAnalysis(base64, i)
        )
      ).then((urls: (string | null)[]) => {
        const validUrls = urls.filter((url): url is string => url !== null);

        const hashRequests = validUrls.map((url) =>
          this.photoService.hashImage(url)
        );

        forkJoin(
          hashRequests as Observable<{ hash: string; url: string }>[]
        ).subscribe((hashResponses) => {
          console.log('Hashes recibidos:', hashResponses);
          const hashUrlPairs = hashResponses.map((res) => ({
            hash: String(res.hash),
            url: res.url,
          }));

          this.photoService
            .compareHashes(hashUrlPairs)
            .subscribe((compareRes) => {
              this.duplicateAlbums = compareRes.albums.filter((a: any) =>
                a.name.includes('Duplicados')
              );
              this.similarAlbums = compareRes.albums.filter((a: any) =>
                a.name.includes('Similares')
              );

              this.mediatorService.updateDuplicatePhotos(
                this.duplicateAlbums.flatMap((a) => a.photos)
              );
              this.mediatorService.updateSimilarPhotos(
                this.similarAlbums.flatMap((a) => a.photos)
              );

              this.isProcessing = false;
              this.albumsLoaded = true;
            });
        });
      });
    });
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
