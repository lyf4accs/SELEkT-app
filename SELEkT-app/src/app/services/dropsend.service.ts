import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropsendService {
  // URL base del servidor HTTP (usa http:// en lugar de ws:// o wss://)
  private baseUrl = 'http://selekt-app.onrender.com';

  // Se mantienen los Subjects para la comunicación interna si los necesitas
  private peersSubject = new Subject<any[]>();
  private peerJoinedSubject = new Subject<any>();
  private peerLeftSubject = new Subject<string>();
  private signalSubject = new Subject<any>();
  private displayNameSubject = new Subject<any>();
  private notificationSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    // Puedes inicializar o suscribirte a algo aquí si lo requieres
  }

  // Método para obtener la lista de dispositivos
  getDevices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/devices`);
  }

  // Método para simular la conexión de un dispositivo
  connectDevice(deviceId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect-device`, { deviceId });
  }

  // Método para simular la desconexión de un dispositivo
  disconnectDevice(deviceId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/disconnect-device`, { deviceId });
  }

  // Método para enviar un archivo al servidor
  sendFile(fileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-file`, fileData);
  }

  // Los métodos de los Subjects se mantienen (puedes usarlos según necesites)
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
