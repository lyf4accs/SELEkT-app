import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { MediatorService } from './mediator.service';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  private socket: WebSocket | undefined;
  private reconnectTimer: any;
  private myPeerId = ''; // Inicializamos el valor en vacío

  private myPeerIdSubject = new BehaviorSubject<string>('');
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
      if (event.data instanceof Blob) {
        // Si es un Blob, lo procesamos como archivo
        console.log('Recibiendo archivo...');
        this.handleReceivedFile(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        // Si es un ArrayBuffer, procesarlo según sea necesario (ej. convertir a un archivo o buffer)
        console.log('Recibiendo ArrayBuffer...');
        this.handleReceivedArrayBuffer(event.data);
      } else {
        // Si no es un Blob ni un ArrayBuffer, intentamos procesarlo como JSON
        try {
          console.log('Recibiendo mensaje:', event.data);
          this.handleMessage(event.data);
        } catch (e) {
          console.error('Error al parsear JSON:', e);
        }
      }
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
    if (message instanceof Blob) {
      // Es un archivo recibido, lo convertimos a ArrayBuffer antes de procesarlo
      console.log('Recibiendo un Blob de tipo:', message.type);
      console.log('Tamaño del Blob:', message.size);
      this.handleReceivedFile(message);
      return;
    }

    let msg;
    try {
      msg = JSON.parse(message);
    } catch (error) {
      console.error('Invalid JSON:', message);
      return;
    }
    console.log('WS message:', msg);

    switch (msg.type) {
      case 'peer-joined':
        // Solo actualizamos el peerId cuando realmente tengamos un peerId
        if (msg.peerId) {
          console.log(msg.peerId);
          this.myPeerIdSubject.next(msg.peerId); // Emitimos el peerId recibido
        }
        this.peerJoinedSubject.next({
          peerId: msg.peerId,
          displayName: msg.displayName,
          deviceName: msg.deviceName,
        });
        console.log('Dispositivo conectado:', msg.peerId);
        break;

      case 'update-devices':
        // Aquí verificamos que solo emitimos el peerId cuando lo tengamos
        if (!this.myPeerIdSubject.getValue() && msg.devices.length > 0) {
          const firstDevice = msg.devices[0]; // Asumimos que el primer dispositivo tiene el peerId
          this.myPeerIdSubject.next(firstDevice.peerId);
        }
        this.peersSubject.next(msg.devices);
        console.log('Dispositivos actualizados:', msg.devices);
        break;

      case 'peer-left':
        this.peerLeftSubject.next(msg.peerId);
        console.log('Dispositivo desconectado:', msg.peerId);
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

      default:
        console.error('Unknown message type:', msg);
    }
  }

  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  private handleReceivedArrayBuffer(arrayBuffer: ArrayBuffer): void {
    // Aquí procesas el ArrayBuffer como archivo binario o lo conviertes a un formato adecuado
    // Por ejemplo, podrías convertirlo a un Blob y luego a un archivo:
    const blob = new Blob([arrayBuffer]);
    this.handleReceivedFile(blob); // Llamamos a la función que ya tienes para manejar los archivos
  }

  private async handleReceivedFile(blob: Blob): Promise<void> {
    console.log('Archivo recibido como Blob.');

    const arrayBuffer = await blob.arrayBuffer();

    // Extraer JSON
    const textDecoder = new TextDecoder();
    const textPart = textDecoder.decode(arrayBuffer.slice(0, 256));
    const jsonEnd = textPart.indexOf('}') + 1;
    const jsonString = textPart.substring(0, jsonEnd);
    const data = JSON.parse(jsonString);

    console.log('Archivo recibido:', data.fileName);

    // Extraer archivo
    const fileBuffer = arrayBuffer.slice(jsonEnd);
    const fileBlob = new Blob([fileBuffer]);

    const notification = window.confirm(
      `¡Nuevo archivo recibido: ${data.fileName}! ¿Deseas descargarlo?`
    );

    if (notification) {
      // Descargar el archivo
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Archivo descargado:', data.fileName);
      this.notificationSubject.next(`Archivo descargado: ${data.fileName}`);
    } else {
      console.log('El usuario canceló la descarga.');
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
    console.log('Enviando archivo al servidor'); // Verifica que esta línea se imprima

    // Verificar que el buffer sea un ArrayBuffer válido
    if (!(buffer instanceof ArrayBuffer)) {
      console.error('El archivo no es un ArrayBuffer válido');
      return;
    }

    // Verificar que el peer tiene un peerId
    if (!peer || !peer.peerId) {
      console.error('Peer no tiene un peerId válido');
      return;
    }

    console.log('Tipo de fileData:', buffer.constructor.name); // Debería ser "ArrayBuffer"

    const message = {
      type: 'send-file',
      fileName: fileName,
      peerId: peer.peerId,
    };

    // Convertir el objeto JSON en una cadena de texto
    const messageString = JSON.stringify(message);
    const messageBuffer = new TextEncoder().encode(messageString); // Convertir texto a ArrayBuffer

    // Combinar los datos en un Blob
    const blob = new Blob([messageBuffer, buffer]);

    // Verificar que la conexión WebSocket esté abierta
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('Enviando archivo como Blob:', blob);
      this.socket.send(blob); // Enviar el Blob
    } else {
      console.error('Socket no está abierto');
    }
  }

  onVisibilityChange(): void {
    if (!document.hidden) {
      this.connect();
    }
  }

  // Creamos una función async que devolverá el peerId cuando esté disponible


  // Métodos para exponer observables a los componentes:
  getMyPeerId(): Observable<string> {
    console.log('pasando la ip a component', this.myPeerId)
    return this.myPeerIdSubject.asObservable();
  }

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
