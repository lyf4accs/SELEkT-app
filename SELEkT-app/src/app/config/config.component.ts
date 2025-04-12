import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Camera,
  CameraResultType,
  CameraSource,
  PermissionStatus,
} from '@capacitor/camera';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent implements OnInit {
  router = inject(Router);
  galleryAccess = false;
  darkMode = false;
  ngOnInit() {
    const saved = localStorage.getItem('galleryPermission');
    this.galleryAccess = saved === 'true';
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  async requestGalleryPermission() {
    const status = await Camera.requestPermissions();

    if (status.photos === 'granted') {
      console.log('Permiso de galería concedido');
      this.galleryAccess = true;
      localStorage.setItem('galleryPermission', 'true');
    } else {
      console.log('Permiso de galería denegado');
      this.galleryAccess = false;
      localStorage.setItem('galleryPermission', 'false');
    }
  }

  onToggleGalleryAccess(event: any) {
    this.galleryAccess = event.target.checked;
    if (this.galleryAccess) {
      this.requestGalleryPermission();
    }
  }
}
