import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf, NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatSelect, MatOption } from '@angular/material/select';

import { DistrictsService, DistrictRequestDTO } from '../../../../../../../../service/locations/districts-service';
import { CountriesService } from '../../../../../../../../service/locations/countries-service';

interface Country {
  propertyId: string;
  countryName: string;
  dialCode: string;
}

@Component({
  selector: 'app-new-districts',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    NgIf,
    NgForOf,
    MatError,
  ],
  templateUrl: './new-districts.html',
  styleUrl: './new-districts.scss'
})
export class NewDistricts implements OnInit, OnDestroy {
  districtForm: FormGroup;
  loading = false;
  countries: Country[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictsService,
    private countryService: CountriesService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<NewDistricts>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.districtForm = this.fb.group({
      countryId: ['', Validators.required],
      names: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // form getters
  get countryControl(): FormControl {
    return this.districtForm.get('countryId') as FormControl;
  }

  get namesControl(): FormControl {
    return this.districtForm.get('names') as FormControl;
  }

  private loadCountries(): void {
    this.countryService.loadCountries('', 0, 1000) // load all countries
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.code==200 && response.data?.dataList) {
            this.countries = response.data.dataList;
          } else {
            this.snackBar.open('Failed to load countries', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error loading countries:', err);
          this.snackBar.open('Error loading countries', 'Close', { duration: 3000 });
        }
      });
  }

  onSubmit(): void {
    if (this.districtForm.valid && !this.loading) {
      this.loading = true;

      const { countryId, names } = this.districtForm.value;
      const districtNames: string[] = names
        .split(/[\n,]+/) // split by newline or comma
        .map((n: string) => n.trim())
        .filter((n: string) => n.length > 0);

      const requests: DistrictRequestDTO ={
        name: districtNames.toString(),
        countryId: countryId
      };

      // if your API supports bulk create, send as one request
      // else loop them
      this.districtService.createDistricts(requests).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Districts created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating districts:', error);
          this.snackBar.open('Error creating districts. Please try again.', 'Close', {
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
}
