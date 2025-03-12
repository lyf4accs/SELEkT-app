import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { MediatorService } from './mediator.service';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  private socket: WebSocket | undefined;
  private reconnectTimer: any;
  private myPeerId: string = ''; // Inicializamos el valor en vacío

  private peersSubject = new BehaviorSubject<any[]>([]);
  private peerJoinedSubject = new Subject<any>();
  private peerLeftSubject = new BehaviorSubject<any>([]);
  private signalSubject = new Subject<any>();
  private displayNameSubject = new Subject<any>();
  private notificationSubject = new Subject<string>();

  constructor(private mediatorService: MediatorService) {
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
      this.notificationSubject.next('Connection lost. Retry in 5 seconds...');
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
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
        // Actualiza la lista de dispositivos con los nombres y dispositivos generados
        this.peersSubject.next(msg.devices);
        break;

      case 'peers':
        this.peersSubject.next(msg.peers);
        break;

      case 'peer-joined':
        // Añadimos el peer y su nombre a la lista de dispositivos conectados
        const peerData = {
          peerId: msg.peerId,
          displayName: msg.displayName,
          deviceName: msg.deviceName,
        };
        this.peerJoinedSubject.next(peerData);
        console.log('Dispositivo conectado:', msg.peerId);
        this.myPeerId = msg.peerId; // Actualiza el myPeerId
        break;

      case 'peer-left':
        this.peerLeftSubject.next(msg.peerId);
        console.log('Dispositivo desconectado:', msg.peerId);
        break;

      case 'receive-file':
        this.handleReceivedFile(msg.fileData, msg.fileName);
        break;

      case 'ping':
        this.send({ type: 'pong' });
        break;

      case 'display-name':
        this.displayNameSubject.next(msg);
        // Cuando recibimos el display-name, lo pasamos al mediador
        this.mediatorService.updateDisplayName(msg.displayName);
        console.log(`Dispositivo conectado con nombre: ${msg.displayName}`);
        break;
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

  private handleReceivedFile(fileData: ArrayBuffer, fileName: string): void {

    const notification = window.confirm(
       `¡Nuevo archivo recibido: ${fileName}! ¿Deseas descargarlo?`
     );

  if (notification) {
    // Si el usuario hace clic en "OK", procederemos con la descarga

    // Convertir el ArrayBuffer a un Blob
    const blob = new Blob([fileData]);
    const url = URL.createObjectURL(blob);

    // Crear un enlace de descarga y simular el clic para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Usamos el nombre del archivo recibido
    link.click();

    console.log('Archivo recibido y descargado:', fileName);
    // Emitir una notificación al usuario de que el archivo ha sido descargado
    this.notificationSubject.next(`Archivo descargado: ${fileName}`);
  } else {
    console.log('El usuario ha cancelado la descarga del archivo.');
  }


  }

  disconnect(): void {
    this.send({ type: 'disconnect' });
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }
  }

  sendFile(buffer: ArrayBuffer, fileName: string, peer: any): void {
    const message = {
      type: 'send-file',
      fileName: fileName,
      fileData: buffer,
    };

    // Enviar el archivo al peer seleccionado usando WebSocket
    if (peer.socket) {
      peer.socket.send(JSON.stringify(message));
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
