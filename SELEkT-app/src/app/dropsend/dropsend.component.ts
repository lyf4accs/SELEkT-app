// // Importamos los módulos y servicios necesarios de Angular y de nuestra aplicación.
// import { Component, OnInit } from '@angular/core';
// import { NameGeneratorService } from '../services/name-generator.service';
// import { DropsendService } from '../services/dropsend.service';
// import { PeersComponent } from '../peerscomponent/peerscomponent.component';

// // Decorador Component para definir el componente Dropsend.
// @Component({
//   selector: 'app-dropsend', // Selector para usar este componente en las plantillas.
//   imports: [PeersComponent], // Importamos el componente PeersComponent.
//   templateUrl: './dropsend.component.html', // Ruta al archivo de plantilla HTML del componente.
//   styleUrls: ['./dropsend.component.css'], // Ruta al archivo de estilos CSS del componente.
// })
// export class DropsendComponent implements OnInit {
//   [x: string]: any; // Permite definir propiedades dinámicas en el componente.

//   // Propiedades del componente.
//   showAboutPage = false; // Indica si se debe mostrar la página "Acerca de".
//   showNotification = false; // Indica si se deben mostrar notificaciones.
//   showInstall = false; // Indica si se debe mostrar el prompt de instalación.
//   displayName = 'Unknown'; // Nombre de usuario a mostrar, inicializado en "Desconocido".

//   // Constructor del componente, inyectando los servicios necesarios.
//   constructor(
//     private dropSendService: DropsendService, // Servicio para manejar la lógica de Dropsend.
//     private nameGen: NameGeneratorService // Servicio para generar nombres únicos.
//   ) {}

//   // Método del ciclo de vida de Angular, llamado al inicializar el componente.
//   ngOnInit(): void {
//     // Suscribirse al evento display-name enviado por el servidor.
//     this.dropSendService.getDisplayName().subscribe((msg) => {
//       if (msg && msg.message) {
//         // Si el mensaje recibido contiene un displayName, lo asignamos a la propiedad displayName.
//         this.displayName = msg.message.displayName;
//       }
//     });

//     // Generar un nombre único localmente (para uso inmediato o para enviarlo al servidor).
//     const seed = this.generateSeed(); // Genera una semilla aleatoria.
//     const name = this.nameGen.generateName(seed); // Genera un nombre único usando la semilla.
//     this.displayName = name.displayName; // Asigna el nombre generado a displayName.
//     // Aquí podrías enviar este nombre al servidor, si es necesario.
//   }

//   // Método para generar una semilla aleatoria.
//   generateSeed(): string {
//     // Ejemplo: usar una cadena aleatoria. Alternativamente, se puede usar la cookie o el user-agent.
//     return Math.random().toString(36).substring(2, 15); // Genera una cadena aleatoria.
//   }

//   // Método para mostrar la página "Acerca de".


//   // Método para manejar la lógica de instalación de la aplicación como PWA (Progressive Web App).
//   installApp(): void {
//     // Lógica para mostrar el prompt de instalación PWA.
//   }
// }
