import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  private socket: WebSocket | undefined;
  private reconnectTimer: any;
  private peersSubject = new Subject<any[]>(); // Para notificar cambios en la lista de pares conectados
  private peerJoinedSubject = new Subject<any[]>();
  private peerLeftSubject = new Subject<any[]>();

  constructor() {
    this.connect(); // Conectar al servidor de señalización
    window.addEventListener('beforeunload', () => this.disconnect()); // Manejo de desconexión al cerrar ventana
  }

  private connect(): void {
    // Conexión al servidor de señalización (renderizado en http://selekt-app.onrender.com)
    const endpoint = 'http://selekt-app.onrender.com'; // URL del servidor
    this.socket = new WebSocket(endpoint); // Establecer la conexión WebSocket con el servidor de señalización
    this.socket.onopen = () => {
      console.log('Conectado al servidor de señalización');
    };

    // Manejo de los mensajes del servidor
    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  private handleMessage(message: any): void {
    // Aquí procesamos los mensajes del servidor y actualizamos la lista de dispositivos
    let msg;
    try {
      msg = JSON.parse(message); // Parseamos el mensaje JSON
    } catch (error) {
      console.error('JSON inválido:', message);
      return;
    }

    console.log('Mensaje recibido:', msg);

    // Dependiendo del tipo de mensaje, actualizamos la lista de dispositivos
    switch (msg.type) {
      case 'peers': // Cuando se recibe la lista de dispositivos conectados
        this.peersSubject.next(msg.peers); // Notificamos a los componentes
        break;
      case 'peer-joined': // Cuando un nuevo dispositivo se conecta
        this.peerJoinedSubject.next(msg.peer);
        break;
      case 'peer-left': // Cuando un dispositivo se desconecta
        this.peerLeftSubject.next(msg.peerId);
        break;
    }
  }

  // Obtén la lista de dispositivos conectados
  getPeers(): Observable<any[]> {
    return this.peersSubject.asObservable();
  }

  // Desconectar del servidor
  private disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    clearInterval(this.reconnectTimer);
  }
}
