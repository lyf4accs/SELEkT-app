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
  private lastOffset = 0; // Última posición del indicador

  ngAfterViewInit() {
    this.router.events.subscribe(() => {
      setTimeout(() => this.updateIndicatorPosition(), 50);
    });

    setTimeout(() => this.updateIndicatorPosition(), 50);
  }

  updateIndicatorPosition() {
    requestAnimationFrame(() => {
      const activeItem = document.querySelector(
        '.navigation ul li.active'
      ) as HTMLElement;
      const indicator = document.querySelector('.indicator') as HTMLElement;

      if (!activeItem || !indicator) {
        return;
      }

      // Cálculo de la nueva posición (offset en X) basado en el elemento activo
      const newOffset =
        activeItem.getBoundingClientRect().left -
        activeItem.parentElement!.getBoundingClientRect().left;

      // Obtenemos el desplazamiento actual
      let currentOffset =
        parseFloat(getComputedStyle(indicator).transform.split(',')[4]) ||
        this.lastOffset;

      // Verificamos si la posición ha cambiado
      if (isNaN(currentOffset)) {
        currentOffset = this.lastOffset;
      }

      // Si la posición cambió, actualizamos la posición del indicador
      if (currentOffset !== newOffset) {
        this.renderer.setStyle(
          indicator,
          'transition',
          'transform 0.5s ease-in-out'
        );
        this.renderer.setStyle(
          indicator,
          'transform',
          `translateX(${newOffset}px)`
        );
        this.lastOffset = newOffset;
      }
    });
  }
}
