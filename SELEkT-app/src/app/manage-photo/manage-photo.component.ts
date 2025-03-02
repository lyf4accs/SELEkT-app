import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {
  PhotoLibraryService,
  PhotoAlbum,
} from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-photo.component.html',
  styleUrls: ['./manage-photo.component.css'],
})
export class ManagePhotoComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  photoService = inject(PhotoLibraryService);

  selectedAlbum?: PhotoAlbum; // Álbum seleccionado
  albums: PhotoAlbum[] = []; // Lista de álbumes

  async ngOnInit() {
    // Esperamos la carga de los álbumes
    this.albums = await this.photoService.getPhotoAlbums();
    console.log('Álbumes cargados:', this.albums); // Para depuración
  }

  // Método para seleccionar un álbum
  selectAlbum(album: PhotoAlbum) {
    this.selectedAlbum = album;
  }

  // Método para volver a la lista de álbumes
  goBack() {
    this.selectedAlbum = undefined;
  }
}
