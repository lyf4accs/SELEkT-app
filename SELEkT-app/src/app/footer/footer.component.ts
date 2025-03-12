import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements AfterViewInit {
  renderer = inject(Renderer2);
  router = inject(Router);
  private lastOffset = 0; // Guarda la última posición del indicador

  ngAfterViewInit() {
    this.router.events.subscribe(() => {
      setTimeout(() => this.updateIndicatorPosition(), 50); // Pequeña espera para asegurar que el DOM se actualice
    });

    setTimeout(() => this.updateIndicatorPosition(), 50);
  }

  updateIndicatorPosition() {
    const activeItem = document.querySelector(
      '.navigation ul li.active'
    ) as HTMLElement;
    const indicator = document.querySelector('.indicator') as HTMLElement;

    if (activeItem && indicator) {
      const offset = activeItem.offsetLeft; // Obtener la posición exacta dentro del contenedor

      // Si la posición no ha cambiado, no animamos
      if (this.lastOffset === offset) return;

      this.lastOffset = offset; // Guardamos la nueva posición

      // Aplicamos la animación suavemente
      this.renderer.setStyle(
        indicator,
        'transition',
        'transform 0.5s ease-in-out'
      );
      this.renderer.setStyle(indicator, 'transform', `translateX(${offset}px)`);
    }
  }
}
