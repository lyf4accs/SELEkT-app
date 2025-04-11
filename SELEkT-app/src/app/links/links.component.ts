import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { PhotoFacadeService } from '../services/photoFacade.service';

@Component({
  selector: 'app-links',
  imports: [RouterModule, CommonModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {


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

  goToAlbum(arg0: any) {
    throw new Error('Method not implemented.');
  }

  albums: any[] = [];

  user_id = '8b504335-3181-4507-92c1-25a63345150b'; // Cambia esto por el ID del usuario actual

  async deleteAlbum(album: any) {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar este álbum?'
    );
    if (!confirmed) return;

    const success = await this.photoFacade.deleteAlbum(
      album.id,
      album.code
    );
    if (success) {
      this.albums = this.albums.filter((a: { id: any }) => a.id !== album.id);
    } else {
      console.error('Error al eliminar el álbum');
    }
  }

  constructor(
    private photoFacade: PhotoFacadeService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    this.albums = await this.photoFacade.getUserAlbums(this.user_id);

    for (const album of this.albums) {
      const fotos = await this.photoFacade.getPhotosByAlbumId(album.id); // <--- esto es correcto
      album.previewUrl =
        fotos.length > 0 ? fotos[0].url : 'assets/placeholder.png';
    }
  }
}
