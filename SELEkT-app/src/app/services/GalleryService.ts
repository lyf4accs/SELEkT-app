import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  hasGalleryPermission(): boolean {
    return localStorage.getItem('galleryPermission') === 'true';
  }

  requestGalleryPermission(): boolean {
    const granted = this.hasGalleryPermission();

    if (!granted) {
      confirm(
        '¡No tenemos permiso de galería!\n\nPuedes ajustarlo en la configuración de tu perfil.'
      );
    }

    return granted;
  }

  saveGalleryPermission(granted: boolean): void {
    localStorage.setItem('galleryPermission', granted ? 'true' : 'false');
  }
}
