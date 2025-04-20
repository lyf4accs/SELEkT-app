import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signInUser } from './login.functions';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage: string | null = null;

  constructor(private router: Router) {}
  goBack() {
    this.router.navigate(['/init']);
  }

  async signIn(event: Event) {
    event.preventDefault(); // Evita la recarga del formulario

    const email = (
      document.getElementById('email') as HTMLInputElement
    ).value.toLowerCase();
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;

    if (!email || !password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const success = await signInUser(email, password);
      if (success) {
        // Si el inicio de sesión fue exitoso, navegamos a la siguiente página
        this.router.navigate(['/upload']);
      } else {
        this.errorMessage = 'Email o contraseña incorrectos';
      }
    } catch (error) {
      console.error('ERROR CAPTURADO:', (error as Error).message);
      this.errorMessage = 'Error inesperado, por favor intenta de nuevo.';
    }
  }
}
