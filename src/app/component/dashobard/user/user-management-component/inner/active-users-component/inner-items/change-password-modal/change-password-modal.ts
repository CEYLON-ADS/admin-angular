import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../../../../service/user/user-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './change-password-modal.html',
  styleUrls: ['./change-password-modal.scss']
})
export class ChangePasswordModalComponent {
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);

  public newPassword = '';
  public hidePassword = true;
  public loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string; username: string; mobileNumber: string }) {}

  onChangePassword(): void {
    if (!this.newPassword || this.newPassword.trim().length < 6) {
      this.snackbarService.openWarning('Password must be at least 6 characters long');
      return;
    }

    this.loading = true;
    this.userService.changeUserPassword(this.data.userId, this.newPassword.trim()).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.body?.code === 200 || res?.code === 200) {
          this.snackbarService.openSuccess(res?.body?.message || res?.message || 'Password changed successfully');
          this.dialogRef.close(true);
        } else {
          this.snackbarService.openWarning(res?.body?.message || 'Failed to update password');
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.snackbarService.openWarning(err?.error?.message || 'Error changing password');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
