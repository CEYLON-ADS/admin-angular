import {Component, Inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Observable, map, startWith, debounceTime, distinctUntilChanged, switchMap} from 'rxjs';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';

import {CitiesService} from '../../../../../../../../service/locations/cities-service';
import {DistrictsService} from '../../../../../../../../service/locations/districts-service';
import {CityRequestDTO} from '../../../../../../../../service/locations/cities-service';

export interface District {
  propertyId: string;
  name: string;
}

@Component({
  selector: 'app-new-cites',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatOption,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    NgForOf,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe
  ],
  templateUrl: './new-cites.html',
  standalone: true,
  styleUrl: './new-cites.scss'
})
export class NewCites implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  districts: District[] = [];
  filteredDistricts: Observable<District[]>;
  searchDistrict: string = '';
  selectedDistrict: District | null = null;
  selectedDistrictId: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private citiesService: CitiesService,
    private districtsService: DistrictsService,
    private dialogRef: MatDialogRef<NewCites>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slotForm = this.formBuilder.group({
      cityName: ['', [Validators.required]],
      districtName: ['', [Validators.required]]
    });

    this.filteredDistricts = this.slotForm.get('districtName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        this.searchDistrict = typeof value === 'string' ? value : value?.name || '';
        return this.districtsService.searchDistricts(this.searchDistrict, 0, 5).pipe(
          map(response => {
            if (response && response.data && response.data.dataList) {
              return response.data.dataList;
            }
            return response.dataList || [];
          })
        );
      })
    );
  }

  ngOnInit(): void {

  }

  displayFn(district: District): string {
    return district && district.name ? district.name : '';
  }

  onCategorySelected(district: District): void {
    this.selectedDistrict = district;
    this.selectedDistrictId = district.propertyId;
  }

  onSave(): void {
    if (this.slotForm.valid) {
      if (!this.selectedDistrictId) {
        this.snackbarService.openWarning('Please select a valid district from the list');
        return;
      }

      this.isLoading = true;

      const formValue = this.slotForm.value;
      const dto: CityRequestDTO = {
        name: formValue.cityName,
        districtId: this.selectedDistrictId
      };

      this.citiesService.createCity(dto).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.snackbarService.openSuccess('City created successfully!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error creating city:', error);
          this.snackbarService.openWarning(error.error?.message || 'Failed to create city');
        }
      });
    } else {
      Object.keys(this.slotForm.controls).forEach(key => {
        this.slotForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
