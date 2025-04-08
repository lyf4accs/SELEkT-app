import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    console.log('[API] Usando endpoint:', this.apiUrl);
  }

  processImages(images: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, { images });
  }

  hashImage(url: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/hash`, { url });
  }

  compareHashes(hashes: { hash: string; url: string }[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/compare`, { hashes });
  }
}
