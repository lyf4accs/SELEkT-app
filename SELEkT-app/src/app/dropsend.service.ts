import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  private socket: any;
  private devices: string[] = [];

  constructor() {
    this.socket = io('178.237.226.52:3000');





    // Escuchar la actualización de la lista de dispositivos
    this.socket.on('update-devices', (devices: string[]) => {
      this.devices = devices;
    });
  }

  // Emitir un archivo al servidor
  sendFile(file: any) {
    this.socket.emit('send-file', file);
  }

  // Obtener la lista de dispositivos cercanos
  getDevices(): string[] {
    return this.devices;
  }

  // Recibir un archivo
  receiveFile(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive-file', (fileData: any) => {
        observer.next(fileData);
      });
    });
  }
}
