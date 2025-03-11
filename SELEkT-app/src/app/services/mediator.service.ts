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
}
