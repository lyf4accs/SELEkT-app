import { Component, OnInit } from '@angular/core';
import { NameGeneratorService } from '../services/name-generator.service';
import { DropsendService } from '../services/dropsend.service';
import { PeersComponent } from "../peerscomponent/peerscomponent.component";


@Component({
  selector: 'app-dropsend',
  imports: [PeersComponent],
  templateUrl: './dropsend.component.html',
  styleUrl: './dropsend.component.css',
})
export class DropsendComponent implements OnInit {
  showAboutPage = false;
  showNotification = false;
  showInstall = false;
  displayName = 'Unknown';
  // Se pueden agregar variables para controlar diálogos, toasts, etc.

  constructor(
    private dropSendService: DropsendService,
    private nameGen: NameGeneratorService
  ) {}

  ngOnInit(): void {
    // Suscribirse al evento display-name enviado por el servidor
    this.dropSendService.getDisplayName().subscribe((msg) => {
      if (msg && msg.message) {
        this.displayName = msg.message.displayName;
      }
    });

    // Generar un nombre único localmente (para uso inmediato o para enviarlo al servidor)
    const seed = this.generateSeed();
    const name = this.nameGen.generateName(seed);
    this.displayName = name.displayName;
    // Aquí podrías enviar este nombre al servidor, si es necesario
  }

  generateSeed(): string {
    // Ejemplo: usar una cadena aleatoria. Alternativamente, se puede usar la cookie o el user-agent.
    return Math.random().toString(36).substring(2, 15);
  }

  showAbout(): void {
    this.showAboutPage = true;
  }

  installApp(): void {
    // Lógica para mostrar el prompt de instalación PWA
  }
}
