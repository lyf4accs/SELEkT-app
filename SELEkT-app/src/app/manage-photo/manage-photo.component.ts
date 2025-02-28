import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PhotoLibraryService } from '../services/PhotoLibraryService';

@Component({
  selector: 'app-manage-photo',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './manage-photo.component.html',
  styleUrl: './manage-photo.component.css',
})
export class ManagePhotoComponent {
  selectedPhoto: string | undefined; // Permite que sea undefined

  constructor(private photoLibraryService: PhotoLibraryService) {}

  async selectPhoto() {
    this.selectedPhoto = await this.photoLibraryService.getPhoto();
  }
}
