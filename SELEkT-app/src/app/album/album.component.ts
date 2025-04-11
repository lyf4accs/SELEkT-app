import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoFacadeService } from '../services/photoFacade.service';
import { FooterComponent } from '../footer/footer.component';
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

  private route = inject(ActivatedRoute);
  private photoFacade = inject(PhotoFacadeService);
  private router = inject(Router);
  private location = inject(Location);

  async ngOnInit() {
    this.albumCode = this.route.snapshot.paramMap.get('code');
    if (this.albumCode) {
      this.albumId = await this.photoFacade.getAlbumByCode(this.albumCode);

      if (this.albumId) {
        this.photos = await this.photoFacade.getPhotosByAlbumId(this.albumId);
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

  async copyLink(event: MouseEvent, album: any) {
    event.stopPropagation();
    const url = `${window.location.origin}/album/${album.code}`;
    try {
      await this.photoFacade.copyAlbumLink(url);
      alert('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar el enlace: ', err);
    }
  }
}
