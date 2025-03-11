import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  private peerNameSource = new BehaviorSubject<string>(''); // Usamos un Subject para emitir el nombre.
  peerName$ = this.peerNameSource.asObservable(); // Un observable para que otros componentes se suscriban.

  // Método para emitir el nombre
  sendPeerName(name: string): void {
    console.log('🔹 Emitiendo nombre:', name);
    this.peerNameSource.next(name); // Emitimos el nombre al canal.
  }
}
