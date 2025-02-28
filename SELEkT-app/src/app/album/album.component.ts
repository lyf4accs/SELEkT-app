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
}
