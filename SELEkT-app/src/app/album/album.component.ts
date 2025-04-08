// src/app/components/album/album.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  photos: any[] = [];
  albums: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const albumCode = this.route.snapshot.paramMap.get('code');
    if (albumCode) {
      const albumId = await this.supabaseService.getAlbumByCode(albumCode);

      if (albumId) {
        this.photos = await this.supabaseService.getPhotosByAlbumId(albumId);
        console.log(this.photos);
      }
    }
  }

  downloadAll() {
    this.photos.forEach((photo) => window.open(photo.url, '_blank'));
  }

  async deleteAlbum(album: any) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este álbum?'
    );
    if (!confirmed) return;

    const success = await this.supabaseService.deleteAlbum(
      album.id,
      album.code
    );
    if (success) {
      this.albums = this.albums.filter((a: { id: any }) => a.id !== album.id);
    } else {
      console.error('Error al eliminar el álbum');
    }
  }

  copyLink(event: MouseEvent, album: any) {
    event.stopPropagation();
    const url = `${window.location.origin}/album/${album.code}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('Enlace copiado al portapapeles');
      })
      .catch((err) => {
        console.error('Error al copiar el enlace: ', err);
      });
  }
}
