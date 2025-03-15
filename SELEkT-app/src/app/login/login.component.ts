import { Component} from '@angular/core';
import {Router} from '@angular/router'
import { isUser, signInUser } from './login.functions';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent{
  constructor(private router: Router) {}
  errorMessage: string | null = null;




  async signIn() {
    const email = (document.getElementById('email') as HTMLInputElement).value.toLowerCase();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    try {
      await signInUser(email, password);
      const user = await isUser(email);
      if (user) {
        this.router.navigate(['/upload']);
      }
    } catch (error) {
      console.error('ERROR CAPTURADO:', (error as Error).message);
      this.errorMessage = (error as Error).message; // Actualiza el mensaje de error
    }
  }
}
