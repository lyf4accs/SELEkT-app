// Importamos los módulos y servicios necesarios de Angular y de nuestra aplicación.
import { Component, OnInit } from '@angular/core';
import { PeersComponent } from '../peerscomponent/peerscomponent.component';
import { FooterComponent } from '../footer/footer.component';
import { PhotoFacadeService } from '../services/photoFacade.service';

// Decorador Component para definir el componente Dropsend.
@Component({
  selector: 'app-dropsend', // Selector para usar este componente en las plantillas.
  imports: [PeersComponent, FooterComponent], // Importamos el componente PeersComponent.
  templateUrl: './dropsend.component.html', // Ruta al archivo de plantilla HTML del componente.
  styleUrls: ['./dropsend.component.css'], // Ruta al archivo de estilos CSS del componente.
})
export class DropsendComponent implements OnInit {
  showAboutPage = false; // Indica si se debe mostrar la página "Acerca de".
  showNotification = false; // Indica si se deben mostrar notificaciones.
  showInstall = false; // Indica si se debe mostrar el prompt de instalación.
  displayName: string = ''; // Nombre de usuario que se mostrará
  // Constructor del componente, inyectando los servicios necesarios.
  constructor(
// Servicio para generar nombres únicos.
    private photofacade: PhotoFacadeService
  ) {}

  // Método del ciclo de vida de Angular, llamado al inicializar el componente.
  ngOnInit(): void {
    // Nos suscribimos al Mediator para recibir el nombre
    this.photofacade.displayName$.subscribe((name) => {
      if (name) {
        this.displayName = name; // Asignamos el nombre recibido al displayName
      }
    });


  }


  // Método para manejar la lógica de instalación de la aplicación como PWA (Progressive Web App).
  installApp(): void {
    // Lógica para mostrar el prompt de instalación PWA.
  }
}
