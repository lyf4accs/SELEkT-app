import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PhotoFacadeService } from '../services/photoFacade.service';
import { CommonModule } from '@angular/common';
import { Moodboard } from '../models/Moodboard';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { PhotoLibraryService } from '../services/PhotoLibraryService';

@Component({
  selector: 'app-moodboards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moodboards.component.html',
  styleUrl: './moodboards.component.css',
})
export class MoodboardsComponent implements OnInit {
  albums: Moodboard[] = [];
  isLoading = false;
  error = false;

  photofacade = inject(PhotoFacadeService);
  router = inject(Router);
  supabase = inject(SupabaseService);
  photoService = inject(PhotoLibraryService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.albums = this.photofacade.getColorMoodboards() || [];
  }

  async onAddPhotos(event: any) {
    this.isLoading = true;
    this.error = false;

    const files: File[] = Array.from(event.target.files as File[]);
    const base64Images = await Promise.all(files.map(this.toBase64));
    const urls: string[] = [];

    for (let i = 0; i < base64Images.length; i++) {
      const url = await this.photofacade.uploadToColorBucket(
        base64Images[i],
        i
      );
      if (url) urls.push(url);
    }

    try {
      const colorRes = await firstValueFrom(
        this.photofacade.getDominantColors(urls)
      );
      const paletteRes = await firstValueFrom(
        this.photofacade.groupByPalette(colorRes.results)
      );

      const existingAlbums = [...this.albums];

      for (const newAlbum of paletteRes.albums || []) {
        const match = existingAlbums.find(
          (a) => a.colorKey === newAlbum.colorKey
        );

        if (match) {
          newAlbum.photos.forEach((photo: string) => {
            if (!match.photos.includes(photo)) {
              match.photos.push(photo);
            }
          });

          if (!match.coverPhoto && newAlbum.coverPhoto) {
            match.coverPhoto = newAlbum.coverPhoto;
          }
        } else {
          existingAlbums.push(newAlbum);
        }
      }

      this.albums = existingAlbums;
      this.photofacade.setColorMoodboards(this.albums);
    } catch (err) {
      console.error('Error procesando colores:', err);
      this.error = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  toBase64(file: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  renameMoodboard(album: Moodboard) {
    const newName = prompt('Nuevo nombre del moodboard:', album.name);
    if (newName) {
      album.name = newName;
      this.photofacade.setColorMoodboards(this.albums);
      this.cdr.detectChanges();
    }
  }

  deleteMoodboard(index: number) {
    if (confirm('¿Eliminar este moodboard completo?')) {
      this.albums.splice(index, 1);
      this.photofacade.setColorMoodboards(this.albums);
      this.cdr.detectChanges();
    }
  }

  removePhotoFromMoodboard(photo: string, albumIndex: number) {
    const album = this.albums[albumIndex];
    album.photos = album.photos.filter((p) => p !== photo);

    if (album.photos.length === 0) {
      this.deleteMoodboard(albumIndex); // Eliminar si queda vacío
    } else {
      this.photofacade.setColorMoodboards(this.albums);
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
