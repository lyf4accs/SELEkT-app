import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-links',
  imports: [RouterModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css',
})
export class LinksComponent implements OnInit {
  albums: any[] = [];

  user_id = 1;

  constructor(private supabaseService: SupabaseService) {}

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
