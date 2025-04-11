import { Component, OnInit } from '@angular/core';
import { PhotoFacadeService } from '../services/photoFacade.service';

@Component({
  selector: 'app-peerscomponent',
  templateUrl: './peerscomponent.component.html',
  styleUrls: ['./peerscomponent.component.css'],
})
export class PeersComponent implements OnInit {
  peers: any[] = [];
  peerIdsSet: Set<string> = new Set();
  myPeerId: string | null | undefined;
  myDeviceName: string = '';
  displayName: string = '';

  constructor(
    private photoFacade: PhotoFacadeService
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener el Peer ID

      this.photoFacade.getMyPeerId().subscribe((peerId) => {
        this.myPeerId = peerId;
        console.log('Mi Peer ID:', this.myPeerId);

          // Solo suscribir a los peers y actualizar la lista si ya se ha obtenido el myPeerId
        if (this.myPeerId) {
          this.photoFacade.getPeers().subscribe((peers) => {
            this.updatePeersList(peers);
          });
        }
      });
    // Obtener el display name
    this.photoFacade.getDisplayNameSignal().subscribe((displayName: string) => {
      this.photoFacade.updateDisplayName(displayName);
    });



    // Suscribirse a los eventos de nuevos peers
    this.photoFacade.getPeers().subscribe((peers) => {
      this.updatePeersList(peers);
    });

    // Escuchar cuando un peer se conecta
    this.photoFacade.getPeerJoined().subscribe((peer) => {
      console.log('lo añadimos porque es nuevo')
      this.addPeer(peer);
    });

    // Escuchar cuando un peer se desconecta
    this.photoFacade.getPeerLeft().subscribe((peerId) => {
      this.removePeer(peerId);
    });
  }

  private updatePeersList(peers: any[]): void {
    if (!this.myPeerId) {
      // Si aún no tenemos el myPeerId, no actualizamos la lista
      console.log('Esperando a que myPeerId esté disponible...');
      return;
    }

    // Limpiar la lista de peers antes de actualizarla
    peers.forEach((peer) => {
    if (peer.peerId !== this.myPeerId && !this.peerIdsSet.has(peer.peerId)) {
      // Agregar el nuevo peer
      this.peerIdsSet.add(peer.peerId);
      this.peers.push(peer);
      console.log('Nuevo peer añadido:', peer.peerId);
    }
  });
}

private addPeer(peer: any): void {
  // Solo agregar el peer si no está ya en la lista
  console.log(peer);
  console.log(this.peerIdsSet);
  if (peer.peerId !== this.myPeerId && !this.peerIdsSet.has(peer.peerId)) {
    this.peerIdsSet.add(peer.peerId);
    this.peers.push(peer);
    console.log('Nuevo peer conectado:', peer);
  }
}


  private removePeer(peerId: string): void {
    // Eliminar el peer de la lista cuando se desconecta
    this.peerIdsSet.delete(peerId);
    this.peers = this.peers.filter((peer) => peer.peerId !== peerId);
  }

  selectPeer(peer: any): void {
    console.log('Seleccionado el peer:', peer);
    // Crear un input de tipo file y simular el clic para que se abra el selector de archivos
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.click();

    //cuando seleccione el archivo se procede a enviarlo
    fileInput.onchange = (event: any) => this.onFilesSelected(event, peer);
  }

  onFilesSelected(event: Event, peer: any): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement?.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const arrayBuffer = e.target.result; // El ArrayBuffer del archivo

          // Enviar el archivo al peer
          this.photoFacade.sendFile(arrayBuffer, file.name, peer);
        };
        reader.readAsArrayBuffer(file);
      });
    }
  }
}
