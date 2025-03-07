import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  private socket: WebSocket | undefined;
  private reconnectTimer: any;
  private myPeerId: string = ''; // Inicializamos el valor en vacío

  private peersSubject = new Subject<any[]>();
  private peerJoinedSubject = new Subject<any>();
  private peerLeftSubject = new Subject<string>();
  private signalSubject = new Subject<any>();
  private displayNameSubject = new Subject<any>();
  private notificationSubject = new Subject<string>();

  constructor() {
    this.connect();
    window.addEventListener('beforeunload', () => this.disconnect());
    document.addEventListener('visibilitychange', () =>
      this.onVisibilityChange()
    );
  }

  private connect(): void {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    const endpoint = this.getEndpoint();
    this.socket = new WebSocket(endpoint);
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = () => {
      console.log('WS: connected');
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      console.log('WS: disconnected');
      this.notificationSubject.next('Connection lost. Retry in 10 seconds...');
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => this.connect(), 10000);
    };

    this.socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  private getEndpoint(): string {
    const endpoint =
      'wss://web-fdtu2nbtpzf0.up-de-fra1-k8s-1.apps.run-on-seenode.com';
    return endpoint;
  }

  private handleMessage(message: any): void {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (error) {
      console.error('Invalid JSON:', message);
      return;
    }
    console.log('WS message:', msg);

    switch (msg.type) {
      case 'update-devices':
        console.log('Dispositivos actualizados:', msg.devices);
        this.peersSubject.next(msg.devices);
        break;

      case 'peers':
        this.peersSubject.next(msg.peers);
        break;

      case 'peer-joined':
        this.peerJoinedSubject.next(msg.peer);
        console.log('Dispositivo conectado:', msg.peer);
        this.myPeerId = msg.peer; // Actualiza el myPeerId
        console.log(this.myPeerId); // Este es el valor actualizado de myPeerId
        break;

      case 'peer-left':
        this.peerLeftSubject.next(msg.peerId);
        break;

      case 'signal':
        this.signalSubject.next(msg);
        break;

      case 'ping':
        this.send({ type: 'pong' });
        break;

      case 'display-name':
        this.displayNameSubject.next(msg);
        break;

      default:
        console.error('Unknown message type:', msg);
    }
  }

  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    this.send({ type: 'disconnect' });
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }
  }

  onVisibilityChange(): void {
    if (!document.hidden) {
      this.connect();
    }
  }

  // Creamos una función async que devolverá el peerId cuando esté disponible
  async getMyPeerId(): Promise<string> {
    return new Promise((resolve) => {
      // Comprobamos si ya está disponible
      if (this.myPeerId) {
        resolve(this.myPeerId);
      } else {
        // En caso contrario, esperamos a que se reciba
        const interval = setInterval(() => {
          if (this.myPeerId) {
            resolve(this.myPeerId);
            clearInterval(interval); // Limpiamos el intervalo
          }
        }, 100);
      }
    });
  }

  // Métodos para exponer observables a los componentes:
  getPeers(): Observable<any[]> {
    return this.peersSubject.asObservable();
  }

  getPeerJoined(): Observable<any> {
    return this.peerJoinedSubject.asObservable();
  }

  getPeerLeft(): Observable<string> {
    return this.peerLeftSubject.asObservable();
  }

  getSignal(): Observable<any> {
    return this.signalSubject.asObservable();
  }

  getDisplayName(): Observable<any> {
    return this.displayNameSubject.asObservable();
  }

  getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable();
  }
}
