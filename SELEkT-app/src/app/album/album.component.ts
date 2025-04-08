// src/app/components/album/album.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { FooterComponent } from "../footer/footer.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  imports: [FooterComponent],
})
export class AlbumComponent implements OnInit {
  photos: any[] = [];
  albums: any[] = [];

  public albumCode: string | null = null;
  public albumId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router,
    private location: Location,
  ) {}

  async ngOnInit() {
    this.albumCode = this.route.snapshot.paramMap.get('code');
    if (this.albumCode) {
      this.albumId = await this.supabaseService.getAlbumByCode(this.albumCode);

      if (this.albumId) {
        this.photos = await this.supabaseService.getPhotosByAlbumId(
          this.albumId
        );
        console.log(this.photos);
      }
    }
  }

  downloadAll() {
    this.photos.forEach((photo) => window.open(photo.url, '_blank'));
  }

  goBack() {
    this.location.back();
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
