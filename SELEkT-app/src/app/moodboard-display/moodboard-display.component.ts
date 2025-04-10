import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MediatorService } from '../services/mediator.service';
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
  mediator = inject(MediatorService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const allAlbums = this.mediator.getColorMoodboards();
    this.album = allAlbums[id];
    const index = Number(this.route.snapshot.paramMap.get('id'));
    const albums = this.mediator.getColorMoodboards();
    this.album = albums[index];
  }

  goBack() {
    this.router.navigate(['/moodboards']);
  }

  openPhoto(url: string) {
    this.selectedPhoto = url;
  }

  deletePhoto(photoUrl: string) {
    if (!this.album) return;

    // Elimina la foto del álbum
    this.album.photos = this.album.photos.filter((p) => p !== photoUrl);

    // Si era la cover, cambia la cover
    if (this.album.coverPhoto === photoUrl) {
      this.album.coverPhoto = this.album.photos[0] || '';
    }

    // Actualiza en Mediator (si hace falta persistencia)
    const albums = this.mediator.getColorMoodboards();
    const index = albums.findIndex((a) => a.colorKey === this.album?.colorKey);
    if (index !== -1) {
      albums[index] = this.album;
      this.mediator.setColorMoodboards(albums);
    }

    // Cierra el modal
    this.selectedPhoto = null;
  }
}
