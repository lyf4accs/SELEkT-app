import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  private peerNameSource = new Subject<string>(); // Usamos un Subject para emitir el nombre.
  peerName$ = this.peerNameSource.asObservable(); // Un observable para que otros componentes se suscriban.

  // Método para emitir el nombre
  sendPeerName(name: string): void {
    this.peerNameSource.next(name); // Emitimos el nombre al canal.
  }
}
