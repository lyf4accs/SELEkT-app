import { Component, OnInit } from '@angular/core';
import { DropsendService } from '../services/dropsend.service';

@Component({
  selector: 'app-peerscomponent',
  imports: [],
  templateUrl: './peerscomponent.component.html',
  styleUrl: './peerscomponent.component.css',
})
export class PeersComponent implements OnInit {
  peers: any[] = [];

  constructor(private dropSendService: DropsendService) {}

  ngOnInit(): void {
    this.dropSendService.getPeers().subscribe((peers) => {
      this.peers = peers;
    });
    // También se pueden suscribir a eventos de peer-joined y peer-left según se requiera.
  }

  selectPeer(peer: any): void {
    // Lógica para seleccionar un peer para enviar archivos o texto.
    console.log('Selected peer:', peer);
  }

  getIcon(peer: any): string {
    // Determina el ícono a mostrar según el tipo de dispositivo.
    if (peer.name.device && peer.name.device.type === 'mobile') {
      return '#phone-iphone';
    }
    // Por defecto, se usa el ícono de escritorio.
    return '#desktop-mac';
  }
}
