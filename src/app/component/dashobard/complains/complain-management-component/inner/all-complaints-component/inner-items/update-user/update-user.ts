// Component TypeScript
import {Component, Inject, OnInit} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryRequestDTO} from '../../../../../../../../dto/category-request-dto';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {ProgressSpinner} from '../../../../../../../core/progress-spinner/progress-spinner';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {UserService} from '../../../../../../../../service/user/user-service';
import {ApplicationUserRequestDTO} from '../../../../../../../../dto/application-user-request-dto';

@Component({
  selector: 'app-update-user',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    ProgressSpinner,
    MatProgressSpinnerModule,
    NgClass,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './update-user.html',
  standalone: true,
  styleUrl: './update-user.scss'
})
export class UpdateUser implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  user: any;
  initialFormValue: any; // Store the initial form value

  mobileNumber:string = "";
  countryCodes = ['+94', '+91'];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackbarService,
    private userService:UserService,
    public dialogRef: MatDialogRef<UpdateUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data;

    this.form = this.fb.group({
      mobileNumber: ['', Validators.required],
      // code: ['+94', Validators.required],
      // phone: ['', [Validators.required, Validators.pattern('^[0-9]{7,12}$')]]
    });
  }

  ngOnInit(): void {
    console.log('update user', this.user);

    // Patch the form with initial values
    this.form.patchValue({
      mobileNumber: this.user.mobileNumber
    });

    // Store the initial form value after patching
    this.initialFormValue = this.form.value;
  }

  // Method to check if form has changed
  get hasFormChanged(): boolean {
    return JSON.stringify(this.form.value) !== JSON.stringify(this.initialFormValue);
  }

  // Method to check if update button should be disabled
  get isUpdateDisabled(): boolean {
    return !this.form.valid || !this.hasFormChanged || this.loading;
  }

  updateUser() {
    if (this.form.valid && this.hasFormChanged) {
      this.loading = true;

      const dto: ApplicationUserRequestDTO = {
        mobileNumber: this.form.value.mobileNumber
      }

      this.userService.updateUser(this.user.propertyId, dto).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackbarService.openSuccess(response.body.message);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('error', error);
          this.loading = false;
          this.snackbarService.openWarning(error.error.message);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
