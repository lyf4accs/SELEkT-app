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
  peerIdsSet: Set<string> = new Set(); // 🆕 Set para evitar duplicados
  myPeerId: string = '';

  constructor(
    private dropSendService: DropsendService,
    private nameGeneratorService: NameGeneratorService,
    private mediatorService: MediatorService
  ) {}

  async ngOnInit(): Promise<void> {
    // 1️⃣ Obtener Peer ID antes de suscribirse a eventos
    this.myPeerId = await this.dropSendService.getMyPeerId();
    console.log('Peer ID actualizado:', this.myPeerId);

    // 2️⃣ Generar y enviar el nombre del propio peer
    const seed = this.myPeerId || Math.random().toString(36).substring(2, 15);
    const { displayName } = this.nameGeneratorService.generateName(seed);
    this.mediatorService.sendPeerName(displayName);
    console.log('🔹 Enviando mi nombre:', displayName);

    // 3️⃣ Suscribirse a eventos de peers
    this.dropSendService.getPeers().subscribe((peers) => {
      this.updatePeersList(peers);
    });

    // 4️⃣ Escuchar cuando un peer se conecta
    this.dropSendService.getPeerJoined().subscribe((peer) => {
      this.addPeer(peer);
    });

    // 5️⃣ Escuchar cuando un peer se desconecta
    this.dropSendService.getPeerLeft().subscribe((peerId) => {
      this.removePeer(peerId);
    });
  }

  /** 🔄 Sincroniza la lista de peers evitando duplicados **/
  private updatePeersList(peers: any[]): void {
    // 🧹 Limpiar la lista y el Set antes de actualizar
    this.peers = [];
    this.peerIdsSet.clear();

    peers.forEach((peer) => {
      if (peer.id !== this.myPeerId && !this.peerIdsSet.has(peer.id)) {
        this.addPeer(peer);
      }
    });

    console.log('📌 Lista sincronizada de peers:', this.peers);
  }

  /** ➕ Añadir un peer si no está en la lista **/
  private addPeer(peer: any): void {
    if (!this.peerIdsSet.has(peer.id) && peer.id !== this.myPeerId) {
      this.peerIdsSet.add(peer.id);
      const { displayName, deviceName } =
        this.nameGeneratorService.generateName(peer.id);
      this.peers.push({ ...peer, name: { displayName, deviceName } });
      console.log('✅ Peer conectado:', peer.id);
    }
  }

  /** ❌ Eliminar un peer si se desconecta **/
  private removePeer(peerId: string): void {
    if (this.peerIdsSet.has(peerId)) {
      this.peerIdsSet.delete(peerId);
      this.peers = this.peers.filter((peer) => peer.id !== peerId);
      console.log('❌ Peer desconectado:', peerId);
    }
  }

  selectPeer(peer: any): void {
    console.log('Selected peer:', peer);
  }

  getIcon(peer: any): string {
    return '#desktop-mac';
  }
}
