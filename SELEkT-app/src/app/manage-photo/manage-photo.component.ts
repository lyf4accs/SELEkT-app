import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { MediatorService } from '../services/mediator.service';
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
    if (
      this.mediatorService.getDuplicatePhotos().length > 0 ||
      this.mediatorService.getSimilarPhotos().length > 0
    ) {
      this.duplicateAlbums = this.mediatorService.getAlbums('duplicate');
      this.similarAlbums = this.mediatorService.getAlbums('similar');
      this.albumsLoaded = true;
    }
  }

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
  triggerFileUpload() {
    const input = document.getElementById('file') as HTMLInputElement;
    input?.click();
  }

  processImages(): void {
    if (this.selectedImages.length === 0) {
      alert('Por favor, selecciona imágenes primero.');
      return;
    }

    this.isProcessing = true;
    this.mediatorService.clearHashes(); // 🧹 limpiar hashes anteriores

    const base64Images = this.selectedImages.map((img) => img.base64);

    this.supabaseService.clearAnalysisBucket().then(() => {
      Promise.all(
        base64Images.map((base64, i) =>
          this.supabaseService.uploadImageForAnalysis(base64, i)
        )
      ).then((uploads) => {
        const valid = uploads.filter(
          (u): u is { fileName: string; url: string } => !!u
        );

        const hashRequests = valid.map(({ url }) =>
          this.photoService.hashImage(url)
        );

        forkJoin(hashRequests).subscribe((hashResponses) => {
          const hashUrlPairs = hashResponses.map((res, i) => ({
            hash: String(res.hash),
            url: res.url,
            fileName: valid[i].fileName,
          }));

          this.mediatorService.setHashes(hashUrlPairs); // 💾 Guardar los hashes

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
                this.duplicateAlbums.flatMap((a) => a.photos),
                this.duplicateAlbums // 💾 guardar álbumes
              );

              this.mediatorService.updateSimilarPhotos(
                this.similarAlbums.flatMap((a) => a.photos),
                this.similarAlbums
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
      this.mediatorService.updateDuplicatePhotos(album.photos);
    } else if (albumType === 'similar' && albumIndex !== undefined) {
      this.whichAlbum = 'similar';
      this.mediatorService.setWhichAlbum(this.whichAlbum);
      const album = this.similarAlbums[albumIndex];
      this.mediatorService.updateSimilarPhotos(album.photos);
    }

    // Cover photos
    this.duplicateAlbums.forEach((album) => {
      if (album.photos.length > 0) {
        album.coverPhoto = album.photos[0];
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
