import { Component, ElementRef, ViewChild } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-upload-files',
  imports: [FooterComponent],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css',
})
export class UploadFilesComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // 👈 acceso al input
  files: { file: File; url: string }[] = [];
  albumLink: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  openFileSelector() {
    console.log('disparando input');
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

  async uploadPhotos() {
    if (this.files.length === 0) {
      alert('Por favor, selecciona un archivo');
    }
    console.log('llanado a uploadAlbum');
    const soloArchivos = this.files.map((f) => f.file);
    this.albumLink = await this.supabaseService.uploadAlbum(soloArchivos);
    if (this.albumLink) {
      alert(`Álbum creado: ${this.albumLink}`);
    }
  }

  copyLink() {
    if (this.albumLink) {
      navigator.clipboard
        .writeText(this.albumLink)
        .then(() => {
          alert('Enlace copiado al portapapeles.');
        })
        .catch((err) => {
          console.error('Error al copiar el enlace: ', err);
        });
    }
  }
}

