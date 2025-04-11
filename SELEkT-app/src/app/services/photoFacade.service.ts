import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Moodboard } from '../models/Moodboard';

// Nuevos servicios
import { DuplicatePhotoService } from './duplicate-photo.service';
import { SimilarPhotoService } from './similar-photo.service';
import { HashService } from './hash.service';

// Servicios existentes
import { PhotoLibraryService } from './PhotoLibraryService';
import { SupabaseService } from './supabase.service';
import { ClipboardService } from './clip-board.service';
@Injectable({
  providedIn: 'root',
})
export class PhotoFacadeService {
  private displayNameSubject = new BehaviorSubject<string>('');
  displayName$ = this.displayNameSubject.asObservable();

  private whichAlbum: string | undefined = undefined;
  private colorMoodboards: Moodboard[] = [];

  duplicatePhotos$!: Observable<any[]>;
  similarPhotos$!: Observable<any[]>;

  constructor(
    private duplicatePhotoService: DuplicatePhotoService,
    private similarPhotoService: SimilarPhotoService,
    private hashService: HashService,
    private photoLibraryService: PhotoLibraryService,
    private supabaseService: SupabaseService,
    private clipboardService: ClipboardService
  ) {
    this.duplicatePhotos$ = this.duplicatePhotoService.duplicatePhotos$;
    this.similarPhotos$ = this.similarPhotoService.similarPhotos$;
  }

  updateDisplayName(displayName: string): void {
    this.displayNameSubject.next(displayName);
  }

  setWhichAlbum(whichAlbum: string | undefined): void {
    this.whichAlbum = whichAlbum;
    console.log('setWhichAlbum: ' + this.whichAlbum);
  }

  getWhichAlbum(): string | undefined {
    console.log('getWhichAlbum: ' + this.whichAlbum);
    return this.whichAlbum;
  }

  // Delegaciones claras a los nuevos servicios
  updateDuplicatePhotos(photos: any[], albums?: any[]) {
    this.duplicatePhotoService.updateDuplicatePhotos(photos, albums);
  }

  updateSimilarPhotos(photos: any[], albums?: any[]) {
    this.similarPhotoService.updateSimilarPhotos(photos, albums);
  }

  getDuplicatePhotos(): any[] {
    return this.duplicatePhotoService.getDuplicatePhotos();
  }

  getSimilarPhotos(): any[] {
    return this.similarPhotoService.getSimilarPhotos();
  }

  getAlbums(type: 'duplicate' | 'similar'): any[] {
    return type === 'duplicate'
      ? this.duplicatePhotoService.getDuplicateAlbums()
      : this.similarPhotoService.getSimilarAlbums();
  }

  setHashes(pairs: { hash: string; url: string; fileName: string }[]) {
    this.hashService.setHashes(pairs);
  }

  getHashes(): { hash: string; url: string; fileName: string }[] {
    return this.hashService.getHashes();
  }

  clearHashes(): void {
    this.hashService.clearHashes();
  }

  // Delegación a servicios existentes
  uploadAndProcessPhotos(files: File[]): Promise<string | null> {
    return this.supabaseService.uploadAlbum(files);
  }

  copyAlbumLink(link: string): Promise<void> {
    return this.clipboardService.writeText(link);
  }

  processImages(images: string[]) {
    return this.photoLibraryService.processImages(images);
  }

  // Gestión específica de Moodboards
  setColorMoodboards(albums: Moodboard[]) {
    this.colorMoodboards = albums;
    localStorage.setItem('colorMoodboards', JSON.stringify(albums));
  }

  getColorMoodboards(): Moodboard[] {
    const fromStorage = localStorage.getItem('colorMoodboards');
    if (fromStorage) this.colorMoodboards = JSON.parse(fromStorage);
    return this.colorMoodboards;
  }
}
