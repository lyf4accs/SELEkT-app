import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  // Subject para mantener el nombre del dispositivo
  private displayNameSubject = new BehaviorSubject<string>('');
  displayName$ = this.displayNameSubject.asObservable();

  updateDisplayName(displayName: string): void {
    this.displayNameSubject.next(displayName);
  }

  // Subject para las fotos duplicadas
  private duplicatePhotosSubject = new BehaviorSubject<any[]>([]); // Cambié el tipo a array vacío
  duplicatePhotos$ = this.duplicatePhotosSubject.asObservable();

  // Subject para las fotos similares
  private similarPhotosSubject = new BehaviorSubject<any[]>([]); // Cambié el tipo a array vacío
  similarPhotos$ = this.similarPhotosSubject.asObservable();

  // Método para actualizar las fotos duplicadas
  updateDuplicatePhotos(photos: any[]): void {
    this.duplicatePhotosSubject.next(photos); // No es necesario nullificar antes, solo actualizamos
  }

  // Método para actualizar las fotos similares
  updateSimilarPhotos(photos: any[]): void {
    this.similarPhotosSubject.next(photos); // No es necesario nullificar antes, solo actualizamos
  }

  // Variable para almacenar cuál álbum se está visualizando (duplicado o similar)
  private whichAlbum: string | undefined = undefined;

  setWhichAlbum(whichAlbum: string | undefined): void {
    this.whichAlbum = whichAlbum;
    console.log('setWhichAlbum: ' + this.whichAlbum);
  }

  getWhichAlbum(): string | undefined {
    console.log('getWhichAlbum: ' + this.whichAlbum);
    return this.whichAlbum;
  }

  // Métodos adicionales para obtener las fotos de duplicados y similares directamente
  getDuplicatePhotos(): any[] {
    return this.duplicatePhotosSubject.getValue();
  }

  getSimilarPhotos(): any[] {
    return this.similarPhotosSubject.getValue();
  }
}
