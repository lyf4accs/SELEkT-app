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
  displayedNames: Set<string> = new Set();
  myPeerId: string = ''; // Variable para guardar el peerId

  constructor(
    private dropSendService: DropsendService,
    private nameGeneratorService: NameGeneratorService,
    private mediatorService: MediatorService
  ) {}

  async ngOnInit(): Promise<void> {
    // Esperar a que el peerId esté disponible
    this.myPeerId = await this.dropSendService.getMyPeerId();
    console.log('Peer ID actualizado:', this.myPeerId);

    // Suscripción a los peers
    this.dropSendService.getPeers().subscribe((peers) => {
      this.peers = []; // Limpiar la lista de peers antes de actualizar

      peers.forEach((peer) => {
        const seed = peer.id || Math.random().toString(36).substring(2, 15);
        const { displayName, deviceName } =
          this.nameGeneratorService.generateName(seed);

        console.log(peer.id);
        console.log(this.myPeerId); // Ahora tiene el valor actualizado

        // Verificar que no sea el propio peer
        if (
          !this.displayedNames.has(displayName) &&
          !this.displayedNames.has(deviceName) &&
          peer.id !== this.myPeerId // Verificamos que no sea el propio dispositivo
        ) {
          this.displayedNames.add(displayName);
          this.peers.push({
            ...peer,
            name: { displayName, deviceName },
          });

          // Enviamos el nombre si es el propio peer
          if (peer.id === this.myPeerId) {
            this.mediatorService.sendPeerName(displayName);
          }
        }
      });
      console.log(this.peers.length);
    });
  }

  selectPeer(peer: any): void {
    console.log('Selected peer:', peer);
  }

  getIcon(peer: any): string {
    return '#desktop-mac';
  }
}
