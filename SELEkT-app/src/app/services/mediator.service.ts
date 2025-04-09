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
  private duplicatePhotosSubject = new BehaviorSubject<any[]>([]);
  duplicatePhotos$ = this.duplicatePhotosSubject.asObservable();

  // Subject para las fotos similares
  private similarPhotosSubject = new BehaviorSubject<any[]>([]);
  similarPhotos$ = this.similarPhotosSubject.asObservable();

  // Álbumes completos para duplicados y similares
  private duplicateAlbums: any[] = [];
  private similarAlbums: any[] = [];

  // Hashes temporales
  private lastHashUrlPairs: { hash: string; url: string }[] = [];

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

  // Actualizar fotos y guardar álbumes completos
  updateDuplicatePhotos(photos: any[], albums?: any[]): void {
    this.duplicatePhotosSubject.next(photos);
    if (albums) this.duplicateAlbums = albums;
  }

  updateSimilarPhotos(photos: any[], albums?: any[]): void {
    this.similarPhotosSubject.next(photos);
    if (albums) this.similarAlbums = albums;
  }

  // Obtener fotos actuales
  getDuplicatePhotos(): any[] {
    return this.duplicatePhotosSubject.getValue();
  }

  getSimilarPhotos(): any[] {
    return this.similarPhotosSubject.getValue();
  }

  // Obtener álbumes guardados
  getAlbums(type: 'duplicate' | 'similar'): any[] {
    return type === 'duplicate' ? this.duplicateAlbums : this.similarAlbums;
  }

  // Manejo de hashes
  setHashes(pairs: { hash: string; url: string }[]): void {
    this.lastHashUrlPairs = pairs;
  }

  getHashes(): { hash: string; url: string }[] {
    return this.lastHashUrlPairs;
  }

  clearHashes(): void {
    this.lastHashUrlPairs = [];
  }
}
