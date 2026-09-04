import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../../../../service/user/user-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-allocate-credits-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './allocate-credits-modal.html',
  styleUrls: ['./allocate-credits-modal.scss']
})
export class AllocateCreditsModalComponent {
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialogRef = inject(MatDialogRef<AllocateCreditsModalComponent>);

  public amount: number = 10;
  public loading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: string; username: string; mobileNumber: string; currentCredits: number }) {}

  onAllocate(): void {
    if (this.amount === null || this.amount === undefined || this.amount === 0) {
      this.snackbarService.openWarning('Please enter a valid non-zero credit amount');
      return;
    }

    this.loading = true;
    this.userService.allocateCredits(this.data.userId, this.amount).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.body?.code === 200 || res?.code === 200) {
          this.snackbarService.openSuccess(`Successfully allocated ${this.amount} credits`);
          this.dialogRef.close(true);
        } else {
          this.snackbarService.openWarning(res?.body?.message || 'Failed to allocate credits');
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.snackbarService.openWarning(err?.error?.message || 'Error allocating credits');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
