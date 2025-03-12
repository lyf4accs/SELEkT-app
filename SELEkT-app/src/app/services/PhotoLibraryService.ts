import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoLibraryService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  processImages(images: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/processImages`, { images });
  }
}
