import { Component, inject, OnInit } from '@angular/core';
import { PhotoLibraryService } from '../services/PhotoLibraryService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";  // Asegúrate de importar FormsModule

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  moodboards: any[] = []; // Almacenar los moodboards
  newMoodboardName: string = ''; // Nombre del nuevo moodboard
  selectedMoodboard?: any; // Para almacenar el moodboard seleccionado
  imagesForMoodboard: string[] = []; // Imágenes seleccionadas para un moodboard

  photoService = inject(PhotoLibraryService);

  ngOnInit() {
    // Obtener los moodboards del backend
    this.loadMoodboards();
  }

  // Método para cargar los moodboards desde el backend
  loadMoodboards() {
    this.photoService.getMoodboards().subscribe(
      (data) => {
        this.moodboards = data.moodboards;
        console.log('Moodboards cargados:', this.moodboards);
      },
      (error) => {
        console.error('Error al cargar los moodboards:', error);
      }
    );
  }

  // Método para crear un nuevo moodboard
  createMoodboard() {
    if (this.newMoodboardName) {
      this.photoService
        .createMoodboard({ name: this.newMoodboardName })
        .subscribe(
          (data) => {
            this.moodboards.push(data.moodboard);
            this.newMoodboardName = ''; // Limpiar el campo de nombre
            console.log('Nuevo moodboard creado:', data.moodboard);
          },
          (error) => {
            console.error('Error al crear el moodboard:', error);
          }
        );
    }
  }

  // Método para añadir imágenes a un moodboard
  addImagesToMoodboard() {
    if (this.selectedMoodboard && this.imagesForMoodboard.length > 0) {
      this.photoService
        .addImagesToMoodboard(
          this.selectedMoodboard.id,
          this.imagesForMoodboard
        )
        .subscribe(
          (data) => {
            console.log('Imágenes añadidas al moodboard:', data);
          },
          (error) => {
            console.error('Error al añadir imágenes al moodboard:', error);
          }
        );
    }
  }

  // Método para seleccionar un moodboard
  selectMoodboard(moodboard: any) {
    this.selectedMoodboard = moodboard;
    this.imagesForMoodboard = [];
  }

  // Método para añadir imágenes seleccionadas al moodboard
  selectImagesForMoodboard(images: string[]) {
    this.imagesForMoodboard = images;
  }
}
