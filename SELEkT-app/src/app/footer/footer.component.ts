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
  // Obtener la URL actual
  const activeRoute = this.router.url;

  let activeIndex: number;

  // Verificar si la ruta actual pertenece a "manage" (incluye /manage/swiper)
  if (activeRoute.startsWith('/manage')) {
    activeIndex = 2; // Índice de "Manage"
  } else if (activeRoute.startsWith('/upload')) {
    activeIndex = 0;
  } else if (activeRoute.startsWith('/dropsend')) {
    activeIndex = 1;
  } else if (activeRoute.startsWith('/profile')) {
    activeIndex = 3;
  } else {
    activeIndex = 0; // Default
  }

  // Si el índice no ha cambiado, no actualizamos nada
  if (this.lastIndex === activeIndex) {
    return;
  }

  // Obtener el indicador
  const indicator = document.querySelector('.indicator') as HTMLElement;

  if (indicator) {
    // Aplicar transición suave
    this.renderer.setStyle(
      indicator,
      'transition',
      'transform 0.3s ease-out'
    );

    // Mover el indicador a la posición correcta
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
