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
export class ConfigComponent implements OnInit{
  router = inject(Router);
  private _galleryAccess = localStorage.getItem('galleryPermission') === 'true';
  private _darkMode = localStorage.getItem('darkMode') === 'true';
  cdr = inject(ChangeDetectorRef);

 ngOnInit(): void {
    if (this._darkMode) {
      document.body.classList.add('dark-mode');
    }
  }

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

  get darkMode(): boolean {
    return this._darkMode;
  }

  set darkMode(value: boolean) {
    this._darkMode = value;
    localStorage.setItem('darkMode', value ? 'true' : 'false'); // ✅ Guardar en localStorage
    if (value) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.cdr.markForCheck();
  }

}
