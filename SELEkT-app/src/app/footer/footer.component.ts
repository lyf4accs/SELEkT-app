import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  router = inject(Router);
  currentRoute: string = ''; // Variable para guardar la ruta actual

  ngOnInit() {
    // Detecta la ruta actual cuando el componente carga
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Guarda la ruta actual
    });
  }



  isButtonDisabled(path: string): boolean {
    return this.currentRoute === path;
  }

  goToProfile() {
    throw new Error('Method not implemented.');
  }
  goToManage() {
    throw new Error('Method not implemented.');
  }
  goToDropSend() {
    throw new Error('Method not implemented.');
  }
  goToQualitySend() {
    throw new Error('Method not implemented.');
  }
}
