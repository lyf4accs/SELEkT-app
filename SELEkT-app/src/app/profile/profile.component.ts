import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";  // Asegúrate de importar FormsModule
import { Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(private router: Router) {}

  user = {
    username: '@juanperez',
    email: 'juan@example.com',
  };

  goToPremium() {
    this.router.navigate(['/upload']);
  }

  goToConfig() {
    this.router.navigate(['/upload']);
  }

  goToColores() {
    this.router.navigate(['/upload']);
  }

  goToChange() {
    this.router.navigate(['/changePassword']);
  }
}
