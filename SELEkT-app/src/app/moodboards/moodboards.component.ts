import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MediatorService } from '../services/mediator.service';
import { SupabaseService } from '../services/supabase.service';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';
import { Moodboard } from '../models/Moodboard';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moodboards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moodboards.component.html',
  styleUrl: './moodboards.component.css',
})
export class MoodboardsComponent implements OnInit {
  albums: Moodboard[] = [];
  mediator = inject(MediatorService);
  supabase = inject(SupabaseService);
  photoService = inject(PhotoLibraryService);
  cdr = inject(ChangeDetectorRef);
  isLoading = false;
  error = false;

  ngOnInit() {
    this.albums = this.mediator.getColorMoodboards() || [];
  }

  async onAddPhotos(event: any) {
    this.isLoading = true;
    this.error = false;

    const files: File[] = Array.from(event.target.files as File[]);
    const base64Images = await Promise.all(files.map(this.toBase64));
    const urls: string[] = [];

    for (let i = 0; i < base64Images.length; i++) {
      const url = await this.supabase.uploadToColorBucket(base64Images[i], i);
      if (url) urls.push(url);
    }

    try {
      const colorRes = await this.photoService
        .getDominantColors(urls)
        .toPromise();
      const paletteRes = await this.photoService
        .groupByPalette(colorRes.results)
        .toPromise();

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
      this.mediator.setColorMoodboards(this.albums);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error procesando colores:', err);
      this.error = true;
      this.albums = [];
      this.mediator.setColorMoodboards([]);
    } finally {
      this.isLoading = false;
    }
  }

  toBase64(file: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
