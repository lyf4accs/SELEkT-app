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
  }
}
