import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init',
  standalone: true,
  templateUrl: './init.component.html',
  styleUrl: './init.component.css',
})
export class InitComponent {
  router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
