import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SimilarPhotoService {
  private similarPhotosSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  public similarPhotos$: Observable<any[]> =
    this.similarPhotosSubject.asObservable();

  private similarAlbums: any[] = [];

  updateSimilarPhotos(photos: any[], albums?: any[]): void {
    this.similarPhotosSubject.next(photos);
    if (albums) this.similarAlbums = albums;
  }

  getSimilarPhotos(): any[] {
    return this.similarPhotosSubject.getValue();
  }

  getSimilarAlbums(): any[] {
    return this.similarAlbums;
  }
}
