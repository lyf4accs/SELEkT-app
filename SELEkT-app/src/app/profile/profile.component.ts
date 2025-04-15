import { Component} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
  constructor(private router: Router, private location: Location) {}

  user = {
    username: '@juanperez',
    email: 'juan@example.com',
    isPremium: true,
  };

  goToPremium() {
    this.router.navigate(['/premium']);
  }

  goToConfig() {
    this.router.navigate(['/config']);
  }

  goToColores() {
    this.router.navigate(['/moodboards']);
  }

  goToChange() {
    this.router.navigate(['/changePassword']);
  }

  goToLink() {
    this.router.navigate(['/links']);
  }

  goBack() {
    this.location.back();
  }
}
