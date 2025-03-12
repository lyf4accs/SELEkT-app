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

  ngAfterViewInit() {
    this.router.events.subscribe(() => {
      setTimeout(() => this.updateIndicatorPosition(), 10); // Espera que Angular renderice antes de actualizar
    });
    setTimeout(() => this.updateIndicatorPosition(), 10); // Asegurar al cargar
  }

  updateIndicatorPosition() {
    const activeItem = document.querySelector('.list.active') as HTMLElement;
    const indicator = document.querySelector('.indicator') as HTMLElement;

    if (activeItem && indicator) {
      const listItems = Array.from(
        document.querySelectorAll('.navigation ul li')
      ); // Obtener todos los elementos de la lista

      // Encontrar el índice del ítem activo
      const activeIndex = listItems.indexOf(activeItem);

      // Solo realizar el cálculo si el ítem activo existe
      if (activeIndex >= 0) {
        const container = activeItem.parentElement!;
        const itemWidth = activeItem.offsetWidth; // Obtener el ancho de cada item
        const offset = itemWidth * activeIndex; // Calcular el desplazamiento de acuerdo al índice

        // Aplicar la posición de la animación
        this.renderer.setStyle(indicator, 'transition', 'transform 0.5s ease');
        this.renderer.setStyle(
          indicator,
          'transform',
          `translateX(${offset}px)`
        );
      }
    }
  }
}
