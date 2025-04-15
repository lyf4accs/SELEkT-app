import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { GalleryProtectedDirective } from '../shared/directive/gallery.directive';
import { PhotoFacadeService } from '../services/photoFacade.service';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [FooterComponent, CommonModule, GalleryProtectedDirective],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css',
})
export class UploadFilesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // 👈 acceso al input
  files: { file: File; url: string }[] = [];
  albumLink: string | null = null;
  photoFacade= inject(PhotoFacadeService)
  constructor(private supabaseService: SupabaseService) {}

  openFileSelector() {
    console.log('disparando input');
     const granted = this.photoFacade.getGalleryAccess();
    if (!granted) return;
    this.fileInput.nativeElement.click(); // 👈 dispara el input
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const selected = Array.from(target.files);
      this.files = selected.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
    }
  }

  isUploading = false;

  async uploadPhotos() {
    if (this.isUploading) return;

    this.isUploading = true;

    if (this.files.length === 0) {
      alert('Por favor, selecciona un archivo');
      this.isUploading = false;
      return;
    }

    console.log('⏫ Subiendo álbum...');
    const soloArchivos = this.files.map((f) => f.file);
    this.albumLink = await this.supabaseService.uploadAlbum(soloArchivos);

    this.isUploading = false;

    if (this.albumLink) {
      const ir = confirm('✅ Álbum creado. ¿Quieres ir al álbum ahora?');

      if (ir) {
        // Redirige al álbum
        window.location.href = this.albumLink;
      } else {
        // Recarga la vista actual ('upload-files')
        window.location.reload();
      }
    }
  }

  get isButtonDisabled(): boolean {
    return this.files.length === 0 || this.isUploading;
  }
}

