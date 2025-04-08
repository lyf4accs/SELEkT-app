import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-links',
  imports: [RouterModule, CommonModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {

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

  constructor(
    private supabaseService: SupabaseService,
    private router: RouterModule
  ) {}

  async ngOnInit(): Promise<void> {
    this.albums = await this.supabaseService.getUserAlbums(this.user_id);

    for (const album of this.albums) {
      const fotos = await this.supabaseService.getPhotosByAlbumId(album.id); // <--- esto es correcto
      album.previewUrl = fotos.length > 0 ? fotos[0].url : 'assets/placeholder.png';
    }


  }

}
