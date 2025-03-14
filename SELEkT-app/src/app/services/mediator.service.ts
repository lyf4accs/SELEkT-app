import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  private displayNameSubject = new BehaviorSubject<string>(''); // Usamos BehaviorSubject para emitir el nombre
  displayName$ = this.displayNameSubject.asObservable(); // Observable para otros componentes

  // Método para actualizar el nombre del dispositivo
  updateDisplayName(displayName: string): void {
    this.displayNameSubject.next(displayName);
  }

  private duplicatePhotosSubject = new BehaviorSubject<any>(null); // Nuevo subject para duplicados
  duplicatePhotos$ = this.duplicatePhotosSubject.asObservable(); // Observable para duplicados

  private similarPhotosSubject = new BehaviorSubject<any>(null); // Nuevo subject para similares
  similarPhotos$ = this.similarPhotosSubject.asObservable(); // Observable para similares

  // Nuevo método para enviar fotos duplicadas
  updateDuplicatePhotos(photos: any): void {
    this.duplicatePhotosSubject.next(photos); // Emitir las fotos duplicadas
  }

  // Nuevo método para enviar fotos similares
  updateSimilarPhotos(photos: any): void {
    this.similarPhotosSubject.next(photos); // Emitir las fotos similares
  }
}
