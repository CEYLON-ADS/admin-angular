import {Component, Inject, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {DistrictRequestDTO, DistrictsService} from '../../../../../../../../service/locations/districts-service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-district',
  imports: [
    MatIcon,
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatButton,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './update-district.html',
  standalone: true,
  styleUrl: './update-district.scss'
})
export class UpdateDistrict implements OnInit {

  districtForm: FormGroup;
  loading = false;
  district: any;

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictsService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateDistrict>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.district = data;
    this.districtForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z\s\-'\.]+$/)
      ]]
    });
  }

  ngOnInit(): void {
    console.log('selected district ', this.district);

    this.districtForm.patchValue({
      name: this.district.name
    });

    setTimeout(() => {
      const nameInput = document.querySelector('input[formControlName="name"]') as HTMLInputElement;
      if (nameInput) {
        nameInput.focus();
      }
    }, 100);
  }

  get nameControl(): FormControl {
    return this.districtForm.get('name') as FormControl;
  }

  onSubmit(): void {
    if (this.districtForm.valid && !this.loading) {
      this.loading = true;

      const districtData: DistrictRequestDTO = {
        name: this.districtForm.value.name.trim(),
        countryId:'',
      };

      this.districtService.updateDistrict(this.district.propertyID, districtData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('District updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating district:', error);

          let errorMessage = 'Error updating district. Please try again.';

          if (error.status === 400) {
            errorMessage = 'Invalid district data. Please check your input.';
          } else if (error.status === 409) {
            errorMessage = 'A district with this name already exists.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.districtForm.controls).forEach(key => {
      const control = this.districtForm.get(key);
      control?.markAsTouched();
    });
  }

  isUnchanged(): boolean {
    return this.districtForm.value.name === this.district.name;
  }
}
