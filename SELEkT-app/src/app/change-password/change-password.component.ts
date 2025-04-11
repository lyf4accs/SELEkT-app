import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhotoFacadeService } from '../services/photoFacade.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private photoFacade = inject(PhotoFacadeService);
  private location = inject(Location);

  form = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  async changePassword() {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.form.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);
    try {
      const { error } = await this.photoFacade.updatePassword(
        currentPassword!,
        newPassword!
      );
      if (error) throw error;
      this.successMessage.set('Contraseña actualizada correctamente.');
      this.form.reset();
    } catch (error: any) {
      this.errorMessage.set(
        error.message || 'Error al actualizar la contraseña.'
      );
    } finally {
      this.loading.set(false);
    }
  }

  goBack() {
    this.location.back();
  }
}
