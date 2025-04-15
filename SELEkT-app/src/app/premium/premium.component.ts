import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { PasarelaComponent } from '../pasarela/pasarela.component';
@Component({
  selector: 'app-premium',
  imports: [CommonModule, PasarelaComponent],
  standalone: true,
  templateUrl: './premium.component.html',
  styleUrl: './premium.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
  router = inject(Router);

  selectedPlan: string = 'Anual (Prueba gratuita)';
  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  back() {
    this.router.navigate(['/profile']);
  }

  showPayment = false;

  getPrice(plan: string): string {
    switch (plan) {
      case 'Anual (Prueba gratuita)':
        return '29,99 €';
      case 'Mensual':
        return '9,99 €';
      case 'De por vida':
        return '59,99 €';
      default:
        return '0 €';
    }
  }
}
