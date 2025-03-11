import { Component, OnInit } from '@angular/core';
import { DropsendService } from '../services/dropsend.service';
import { NameGeneratorService } from '../services/name-generator.service';
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

  constructor(
    private dropSendService: DropsendService,
    private nameGeneratorService: NameGeneratorService,
    private mediatorService: MediatorService
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener Peer ID y nombre
    this.myPeerId = await this.dropSendService.getMyPeerId();
    // Generar y enviar el nombre del propio peer
    const seed = this.myPeerId || Math.random().toString(36).substring(2, 15);
    const { displayName } = this.nameGeneratorService.generateName(seed);
    this.mediatorService.sendPeerName(displayName);
    console.log('🔹 Enviando mi nombre:', displayName);

    // Enviar nombre al servidor
    this.mediatorService.sendPeerName(this.myDeviceName);

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
    peers = [];
    this.peers = peers.filter((peer) => peer.id !== this.myPeerId);
    console.log('Lista de peers actualizada:', this.peers);
  }

  private addPeer(peer: any): void {
    if (!this.peerIdsSet.has(peer.peerId) && peer.peerId !== this.myPeerId) {
      this.peerIdsSet.add(peer.peerId);
      this.peers.push(peer);
      console.log('Nuevo peer conectado:', peer);
    }
  }

  private removePeer(peerId: string): void {
    this.peerIdsSet.delete(peerId);
    this.peers = this.peers.filter((peer) => peer.peerId !== peerId);
    console.log('Peer desconectado:', peerId);
  }

  selectPeer(peer: any): void {
    console.log('Seleccionado el peer:', peer);
  }
}
