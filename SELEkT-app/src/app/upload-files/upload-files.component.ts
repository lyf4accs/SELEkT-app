import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-upload-files',
  imports: [FooterComponent],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css',
})
export class UploadFilesComponent {
  files: File[] = [];
  albumLink: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  onFileSelected(event: Event) {
    const target = event.target; //target hace referencia al elemento del DOM que disparó el evento. hace referencia al botón
    if (target instanceof HTMLInputElement && target.files) {
      this.files = Array.from(target.files); // Convertimos FileList a un array
    }
  }

  async uploadPhotos() {
    if (this.files.length === 0) {
      alert('Por favor, selecciona un archivo');
    }
    console.log('llanado a uploadAlbum')
    this.albumLink = await this.supabaseService.uploadAlbum(this.files);
    if (this.albumLink) {
      alert(`Álbum creado: ${this.albumLink}`);
    }
  }

  copyLink() {
    if (this.albumLink) {
      navigator.clipboard.writeText(this.albumLink).then(() => {
          alert('Enlace copiado al portapapeles.');
        })
        .catch((err) => {
          console.error('Error al copiar el enlace: ', err);
        });
    }
  }
}

