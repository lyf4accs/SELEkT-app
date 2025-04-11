import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoFacadeService } from '../services/photoFacade.service';
import { RouterModule } from '@angular/router';
import { Moodboard } from '../models/Moodboard';

@Component({
  selector: 'app-moodboard-display',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moodboard-display.component.html',
  styleUrl: './moodboard-display.component.css',
})
export class MoodboardDisplayComponent implements OnInit {
  album!: Moodboard;
  selectedPhoto: string | null = null;
  route = inject(ActivatedRoute);
  router = inject(Router);
  photofacade = inject(PhotoFacadeService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const allAlbums = this.photofacade.getColorMoodboards();
    this.album = allAlbums[id];
    const index = Number(this.route.snapshot.paramMap.get('id'));
    const albums = this.photofacade.getColorMoodboards();
    this.album = albums[index];
  }

  goBack() {
    this.router.navigate(['/moodboards']);
  }

  openPhoto(url: string) {
    this.selectedPhoto = url;
  }

  shufflePhotos() {
    if (!this.album || !this.album.photos.length) return;

    for (let i = this.album.photos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.album.photos[i], this.album.photos[j]] = [
        this.album.photos[j],
        this.album.photos[i],
      ];
    }

    // Actualiza en photofacade
    const albums = this.photofacade.getColorMoodboards();
    const index = albums.findIndex((a) => a.colorKey === this.album?.colorKey);
    if (index !== -1) {
      albums[index] = this.album;
      this.photofacade.setColorMoodboards(albums);
    }
  }

  deletePhoto(photoUrl: string) {
    if (!this.album) return;

    // Elimina la foto del álbum
    this.album.photos = this.album.photos.filter((p) => p !== photoUrl);

    // Si era la cover, cambia la cover
    if (this.album.coverPhoto === photoUrl) {
      this.album.coverPhoto = this.album.photos[0] || '';
    }

    // Actualiza en photofacade (si hace falta persistencia)
    const albums = this.photofacade.getColorMoodboards();
    const index = albums.findIndex((a) => a.colorKey === this.album?.colorKey);
    if (index !== -1) {
      albums[index] = this.album;
      this.photofacade.setColorMoodboards(albums);
    }

    // Cierra el modal
    this.selectedPhoto = null;
  }
}
