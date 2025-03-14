import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Renderer2 } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements AfterViewInit {
  renderer = inject(Renderer2);
  router = inject(Router);
  private positions = [0, 100, 196, 294]; // 4 posiciones fijas (ajústalas según tu layout)
  private lastIndex = -1; // Índice del último ítem activo

  ngAfterViewInit() {
    // Suscripción a eventos de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateIndicatorPosition(); // Actualiza la posición del indicador cuando cambia la ruta
      }
    });

    // Inicialización en el primer renderizado
    setTimeout(() => this.updateIndicatorPosition(), 50);
  }

  updateIndicatorPosition() {
    // Obtener el índice del ítem activo en función de la ruta
    const activeRoute = this.router.url.split('/').pop(); // Obtiene la última parte de la URL
    let activeIndex: number;

    switch (activeRoute) {
      case 'upload':
        activeIndex = 0;
        break;
      case 'dropsend':
        activeIndex = 1;
        break;
      case 'manage':
        activeIndex = 2;
        break;
      case 'profile':
        activeIndex = 3;
        break;
      default:
        activeIndex = 0; // Por defecto, si no hay coincidencia
    }

    // Si el índice no ha cambiado, no actualizamos nada
    if (this.lastIndex === activeIndex) {
      return;
    }

    // Obtener el indicador
    const indicator = document.querySelector('.indicator') as HTMLElement;

    if (indicator) {
      // Asegurarse de que la transición sea visible solo cuando se mueve
      this.renderer.setStyle(
        indicator,
        'transition',
        'transform 0.3s ease-out' // Transición suave
      );

      // Mover el indicador a la posición fija correspondiente solo si es necesario
      this.renderer.setStyle(
        indicator,
        'transform',
        `translateX(${this.positions[activeIndex]}px)`
      );
    }

    // Actualizar el índice del último ítem activo
    this.lastIndex = activeIndex;
  }
}
