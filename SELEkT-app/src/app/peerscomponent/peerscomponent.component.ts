import { Component, OnInit } from '@angular/core';
import { DropsendService } from '../services/dropsend.service';
import { MediatorService } from '../services/mediator.service';

@Component({
  selector: 'app-peerscomponent',
  templateUrl: './peerscomponent.component.html',
  styleUrls: ['./peerscomponent.component.css'],
})
export class PeersComponent implements OnInit {
  peers: any[] = [];
  peerIdsSet: Set<string> = new Set();
  myPeerId: string = '';
  myDeviceName: string = '';
  displayName: string = '';

  constructor(
    private dropSendService: DropsendService,
    private mediatorService: MediatorService
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener el Peer ID
    this.myPeerId = await this.dropSendService.getMyPeerId();
    console.log('Mi Peer ID:', this.myPeerId);

    // Obtener el display name
    this.mediatorService.displayName$.subscribe((name) => {
      this.displayName = name;
      console.log(`Display Name: ${this.displayName}`);
    });

    // Suscribirse a los eventos de nuevos peers
    this.dropSendService.getPeers().subscribe((peers) => {
      console.log('nada más entrar hago update');
      this.updatePeersList(peers);
    });

    // Escuchar cuando un peer se conecta
    this.dropSendService.getPeerJoined().subscribe((peer) => {
      this.addPeer(peer);
    });

    // Escuchar cuando un peer se desconecta
    this.dropSendService.getPeerLeft().subscribe((peerId) => {
      this.removePeer(peerId);
    });
  }

  private updatePeersList(peers: any[]): void {
    // Limpiar la lista de peers antes de actualizarla
    this.peers = peers
      .filter((peer) => peer.peerId !== this.myPeerId) // Filtrar el propio peer
      .filter((peer) => !this.peerIdsSet.has(peer.peerId)); // Filtrar peers ya presentes

    // Asegurarse de que no se agreguen duplicados
    this.peers.forEach((peer) => {
      this.peerIdsSet.add(peer.peerId); // Añadir los peerIds únicos al set
    });

    console.log('Lista de peers actualizada:', this.peers);
  }

  private addPeer(peer: any): void {
    // Si el peer no está en la lista y no es el propio peer, lo agregamos
    if (!this.peerIdsSet.has(peer.peerId) && peer.peerId !== this.myPeerId) {
      this.peerIdsSet.add(peer.peerId);
      this.peers.push(peer);
      console.log('Nuevo peer conectado:', peer);
    }
  }

  private removePeer(peerId: string): void {
    // Eliminar el peer de la lista cuando se desconecta
    this.peerIdsSet.delete(peerId);
    this.peers = this.peers.filter((peer) => peer.peerId !== peerId);
    console.log('Peer desconectado:', peerId);
  }

  selectPeer(peer: any): void {
    console.log('Seleccionado el peer:', peer);
    // Crear un input de tipo file y simular el clic para que se abra el selector de archivos
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    //cuando seleccione el archivo se procede a enviarlo
    fileInput.onchange = (event: any) => this.onFileSelected(event, peer);
  }

  onFileSelected(event: any, peer: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result; // El ArrayBuffer del archivo
        this.dropSendService.sendFile(arrayBuffer, file.name, peer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  sendFile(buffer: ArrayBuffer, fileName: string, peer: any): void {
    const message = {
      type: 'file',
      fileName: fileName,
      fileData: buffer,
    };

    // Enviar el archivo al peer seleccionado usando WebSocket
    if (peer.socket) {
      peer.socket.send(JSON.stringify(message));
    }
  }
}
