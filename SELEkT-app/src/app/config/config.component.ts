import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Camera,
  CameraResultType,
  CameraSource,
  PermissionStatus,
} from '@capacitor/camera';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent {
  router = inject(Router);
  private _galleryAccess = localStorage.getItem('galleryPermission') === 'true';
  darkMode = false;
  cdr = inject(ChangeDetectorRef);

  goBack() {
    this.router.navigate(['/profile']);
  }

  get galleryAccess(): boolean {
    return this._galleryAccess;
  }

  set galleryAccess(value: boolean) {
    this._galleryAccess = value;
    localStorage.setItem('galleryPermission', value ? 'true' : 'false');
    this.cdr.markForCheck();
  }

}
