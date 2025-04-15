import { CommonModule } from '@angular/common';
import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-pasarela',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pasarela.component.html',
  styleUrl: './pasarela.component.css',
})
export class PasarelaComponent {
  @Input() planName!: string;
  @Input() price!: string;
  @Output() cancelClicked = new EventEmitter<void>();

  router = inject(Router);
  fb = inject(FormBuilder);

  paymentForm: FormGroup = this.fb.group({
    cardNumber: [
      '',
      [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)],
    ],
    expiryDate: [
      '',
      [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
    ],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
  });

  formatCardNumber() {
    const rawValue = this.paymentForm.get('cardNumber')?.value || '';
    const digitsOnly = rawValue.replace(/\D/g, '').substring(0, 16); // máx 16 dígitos
    const groups = digitsOnly.match(/.{1,4}/g); // divide en grupos de 4
    const formatted = groups ? groups.join(' ') : '';
    this.paymentForm
      .get('cardNumber')
      ?.setValue(formatted, { emitEvent: false });
  }

  confirmPayment() {
    if (this.paymentForm.valid) {
      alert('¡Pago simulado exitoso!');
      this.router.navigate(['/profile']);
    }
  }

  cancel() {
    alert('Pago cancelado');
    this.cancelClicked.emit();
  }
}
