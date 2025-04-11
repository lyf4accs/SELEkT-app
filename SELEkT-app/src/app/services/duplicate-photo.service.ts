import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DuplicatePhotoService {
  private duplicatePhotosSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  public duplicatePhotos$: Observable<any[]> =
    this.duplicatePhotosSubject.asObservable();

  private duplicateAlbums: any[] = [];

  updateDuplicatePhotos(photos: any[], albums?: any[]): void {
    this.duplicatePhotosSubject.next(photos);
    if (albums) this.duplicateAlbums = albums;
  }

  getDuplicatePhotos(): any[] {
    return this.duplicatePhotosSubject.getValue();
  }

  getDuplicateAlbums(): any[] {
    return this.duplicateAlbums;
  }
}
