import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { signUpUser, camposVacios, validarNombre, validarContrasena, validarCorreoElectronico, validarLongitudContrasena } from './register.functions';

@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private router: Router) {}

  errorMessage: string | null = null; // Esta es la propiedad que mencionaste
  oculto: boolean = false;

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/init']);
  }

  async signUp(): Promise<void> {
    console.log('botón registrándose');

    const email = (document.getElementById('correo') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const fullName = (document.getElementById('nombre') as HTMLInputElement)
      .value;
    const rep = (document.getElementById('rep') as HTMLInputElement).value;

    try {
      if (await camposVacios(email, password)) {
        throw new Error('Rellena todos los campos');
      }
      if (await validarNombre(fullName)) {
        throw new Error(
          'Escribe un nombre sin digitos y sin más de 50 caracteres.'
        );
      }
      if (await validarCorreoElectronico(email)) {
        throw new Error('Email incorrecto. Escribe un email válido');
      }
      if (await validarContrasena(password, rep)) {
        throw new Error('Las contraseñas no coinciden');
      }
      if (await validarLongitudContrasena(password)) {
        throw new Error('La contrasña debe tener 8-16 caracteres');
      }

      console.log('Intento Registrar');
      await signUpUser(email, password, fullName);
      console.log('goToLoginPage() called');
    } catch (error) {
      console.error('ERROR CAPTURADO:', (error as Error).message);
      this.errorMessage = (error as Error).message; // Actualiza el mensaje de error
    }
  }
}
