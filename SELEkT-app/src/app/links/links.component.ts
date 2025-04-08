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
downloadAlbum($event: MouseEvent,_t2: any) {
throw new Error('Method not implemented.');
}
goToAlbum(arg0: any) {
throw new Error('Method not implemented.');
}
  albums: any[] = [];

  user_id = '8b504335-3181-4507-92c1-25a63345150b'; // Cambia esto por el ID del usuario actual

  constructor(private supabaseService: SupabaseService, private router: RouterModule) {}

  async ngOnInit(): Promise<void> {
    this.albums = await this.supabaseService.getUserAlbums(this.user_id);
    console.log(this.albums);
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
      this.albums = this.albums.filter((a) => a.id !== album.id);
    } else {
      console.error('Error al eliminar el álbum');
    }
  }
}
