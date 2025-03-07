import { Injectable } from '@angular/core'; // Importa el decorador Injectable para permitir la inyección de dependencias
import { Observable, Subject } from 'rxjs'; // Importa Observable y Subject de RxJS para la programación reactiva
//Forman parte del patrón observador, porque observan eventos a los que están suscritos.

// El decorador Injectable permite que este servicio se pueda inyectar en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Proporciona este servicio en la raíz de la aplicación
})
export class DropsendService {
  private socket: WebSocket | undefined; // Define la variable socket para manejar la conexión WebSocket (servidr)
  private reconnectTimer: any; // Timer para reintentos de conexión

  // Se definen varios Subjects para emitir eventos específicos a los componentes
  private peersSubject = new Subject<any[]>(); // Para notificar cambios en la lista de pares conectados
  private peerJoinedSubject = new Subject<any>(); // Para notificar cuando un nuevo par se une
  private peerLeftSubject = new Subject<string>(); // Para notificar cuando un par se desconecta
  private signalSubject = new Subject<any>(); // Para manejar señales entre pares
  private displayNameSubject = new Subject<any>(); // Para manejar nombres de pantalla
  private notificationSubject = new Subject<string>(); // Para emitir notificaciones al usuario

  // Constructor que inicializa la conexión y maneja eventos de ventana
  constructor() {
    this.connect(); // Llama al método connect para iniciar la conexión WebSocket
    window.addEventListener('beforeunload', () => this.disconnect()); // Desconecta al cerrar la ventana
    document.addEventListener('visibilitychange', () =>
      this.onVisibilityChange()
    ); // Maneja el cambio de visibilidad de la página
  }

  // Método privado para establecer la conexión WebSocket
  private connect(): void {
    // Verifica si ya hay una conexión WebSocket abierta o en proceso
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return; // Si hay una conexión, no hace nada
    }
    const endpoint = this.getEndpoint(); // Obtiene la URL del servidor WebSocket
    this.socket = new WebSocket(endpoint); // Crea una nueva conexión WebSocket
    this.socket.binaryType = 'arraybuffer'; // Configura el tipo de datos para recibir archivos binarios

    // Evento que se dispara al abrir la conexión
    this.socket.onopen = () => {
      console.log('WS: connected'); // Mensaje de conexión exitosa
    };

    // Evento que se dispara al recibir un mensaje del servidor
    this.socket.onmessage = (event) => {
      this.handleMessage(event.data); // Llama al método handleMessage para procesar el mensaje
    };

    // Evento que se dispara al cerrar la conexión
    this.socket.onclose = () => {
      console.log('WS: disconnected'); // Mensaje de desconexión
      this.notificationSubject.next('Connection lost. Retry in 10 seconds...'); // Notifica al usuario sobre la desconexión
      clearTimeout(this.reconnectTimer); // Limpia el temporizador anterior
      this.reconnectTimer = setTimeout(() => this.connect(), 10000); // Intenta reconectar después de 5 segundos
    };

    // Evento que se dispara en caso de error en la conexión WebSocket
    this.socket.onerror = (err) => {
      console.error('WebSocket error:', err); // Registra el error en la consola
    };
  }

  private getEndpoint(): string {
    const endpoint =
      'wss://web-fdtu2nbtpzf0.up-de-fra1-k8s-1.apps.run-on-seenode.com'; //selecciono la IP donde está el servidor y el puerto donde se ubica
    return endpoint;
  }

  // Método privado para manejar los mensajes recibidos
  private handleMessage(message: any): void {
    let msg; // Variable para almacenar el mensaje procesado
    try {
      msg = JSON.parse(message); // Intenta parsear el mensaje como JSON
    } catch (error) {
      console.error('Invalid JSON:', message); // Maneja errores en caso de que el mensaje no sea un JSON válido
      return; // Sale del método si hubo un error
    }
    console.log('WS message:', msg); // Registra el mensaje en la consola

    // Maneja el mensaje según su tipo
    switch (msg.type) {
      case 'peers':
        this.peersSubject.next(msg.peers); // Notifica a los componentes sobre la lista de pares conectados
        break;
      case 'peer-joined':
        this.peerJoinedSubject.next(msg.peer); // Notifica a los componentes que un nuevo par se ha unido
        break;
      case 'peer-left':
        this.peerLeftSubject.next(msg.peerId); // Notifica a los componentes que un par se ha desconectado
        break;
      case 'signal':
        this.signalSubject.next(msg); // Emite la señal a los componentes
        break;
      case 'ping':
        this.send({ type: 'pong' }); // Responde a un ping del servidor
        break;
      case 'display-name':
        this.displayNameSubject.next(msg); // Actualiza el nombre de pantalla en los componentes
        break;
      default:
        console.error('Unknown message type:', msg); // Maneja tipos de mensaje desconocidos
    }
  }

  // Método para enviar mensajes a través del WebSocket
  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message)); // Envía el mensaje como JSON
    }
  }

  // Método para desconectar la conexión WebSocket
  disconnect(): void {
    this.send({ type: 'disconnect' }); // Informa al servidor que se va a desconectar
    if (this.socket) {
      this.socket.onclose = null; // Limpia el manejador de eventos de cierre
      this.socket.close(); // Cierra la conexión WebSocket
    }
  }

  // Maneja los cambios de visibilidad de la ventana
  onVisibilityChange(): void {
    if (!document.hidden) {
      this.connect(); // Reconecta si la ventana se vuelve visible
    }
  }

  // Métodos para exponer observables a los componentes:
  getPeers(): Observable<any[]> {
    return this.peersSubject.asObservable(); // Permite a los componentes suscribirse a la lista de pares
  }
  getPeerJoined(): Observable<any> {
    return this.peerJoinedSubject.asObservable(); // Permite a los componentes suscribirse a la notificación de nuevos pares
  }
  getPeerLeft(): Observable<string> {
    return this.peerLeftSubject.asObservable(); // Permite a los componentes suscribirse a la notificación de desconexiones
  }
  getSignal(): Observable<any> {
    return this.signalSubject.asObservable(); // Permite a los componentes suscribirse a las señales
  }
  getDisplayName(): Observable<any> {
    return this.displayNameSubject.asObservable(); // Permite a los componentes suscribirse a los nombres de pantalla
  }
  getNotifications(): Observable<string> {
    return this.notificationSubject.asObservable(); // Permite a los componentes suscribirse a notificaciones
  }
}
