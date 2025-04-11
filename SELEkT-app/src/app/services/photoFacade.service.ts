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
import { NameGeneratorService } from './name-generator.service';
import { DropsendService } from './dropsend.service';

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
    private dropSendService: DropsendService,
    private nameGeneratorService: NameGeneratorService,
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

  getAlbumByCode(albumCode: string): Promise<number | null> {
    return this.supabaseService.getAlbumByCode(albumCode);
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

  getUserAlbums(userId: string): Promise<any[]> {
    return this.supabaseService.getUserAlbums(userId);
  }

  deleteAlbum(albumId: number, albumCode: string): Promise<boolean> {
    return this.supabaseService.deleteAlbum(albumId, albumCode);
  }

  getPhotosByAlbumId(albumId: number): Promise<any[]> {
    return this.supabaseService.getPhotosByAlbumId(albumId);
  }

  clearAnalysisBucket(): Promise<void> {
    return this.supabaseService.clearAnalysisBucket();
  }

  uploadImageForAnalysis(
    base64: string,
    index: number
  ): Promise<{ fileName: string; url: string } | null> {
    return this.supabaseService.uploadImageForAnalysis(base64, index);
  }

  copyAlbumLink(link: string): Promise<void> {
    return this.clipboardService.writeText(link);
  }

  processImages(images: string[]) {
    return this.photoLibraryService.processImages(images);
  }

  hashImage(url: string) {
    return this.photoLibraryService.hashImage(url);
  }

  compareHashes(hashes: { hash: string; url: string }[]) {
    return this.photoLibraryService.compareHashes(hashes);
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

  updatePassword(currentPassword: string, newPassword: string) {
    return this.supabaseService.updatePassword(currentPassword, newPassword);
  }

  generateName(seed: string): { displayName: string; deviceName: string } {
    return this.nameGeneratorService.generateName(seed);
  }

  uploadToColorBucket(base64: string, index: number): Promise<string | null> {
    return this.supabaseService.uploadToColorBucket(base64, index);
  }

  getDominantColors(urls: string[]) {
    return this.photoLibraryService.getDominantColors(urls);
  }

  groupByPalette(colors: { url: string; color: string }[]) {
    return this.photoLibraryService.groupByPalette(colors);
  }

  // Conexión y desconexión
  disconnectDropsend(): void {
    this.dropSendService.disconnect();
  }

  sendFile(buffer: ArrayBuffer, fileName: string, peer: any): void {
    this.dropSendService.sendFile(buffer, fileName, peer);
  }

  // Observables
  getMyPeerId(): Observable<string | null> {
    return this.dropSendService.getMyPeerId();
  }

  getPeers(): Observable<any[]> {
    return this.dropSendService.getPeers();
  }

  getPeerJoined(): Observable<any> {
    return this.dropSendService.getPeerJoined();
  }

  getPeerLeft(): Observable<string> {
    return this.dropSendService.getPeerLeft();
  }

  getSignal(): Observable<any> {
    return this.dropSendService.getSignal();
  }

  getDisplayNameSignal(): Observable<string> {
    return this.dropSendService.getDisplayName();
  }

  getNotifications(): Observable<string> {
    return this.dropSendService.getNotifications();
  }
}
