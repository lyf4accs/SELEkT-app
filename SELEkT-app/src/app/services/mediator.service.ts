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

  updateDuplicatePhotos(photos: any): void {
    this.duplicatePhotosSubject.next(null); // Limpiar antes de actualizar
    this.duplicatePhotosSubject.next(photos);
  }

  updateSimilarPhotos(photos: any): void {
    this.similarPhotosSubject.next(null); // Limpiar antes de actualizar
    this.similarPhotosSubject.next(photos);
  }

  w: string | undefined = undefined;
  setWhichAlbum(whichAlbum: string | undefined) {
    this.w= whichAlbum;
    console.log('set:' + this.w);
  }

  getWhichAlbum(): string | undefined {
    console.log('get:' + this.w);
    return this.w;

  }
}
