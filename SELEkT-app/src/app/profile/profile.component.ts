import { Component} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";  // Asegúrate de importar FormsModule
import { Router} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95)' })
        ),
      ]),
    ]),
  ],
})
export class ProfileComponent {
  constructor(private router: Router, private location: Location) {}
  showAboutUs = false;

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
}
