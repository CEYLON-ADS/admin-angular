import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { CitiesService } from '../../../../../../../../service/locations/cities-service';
import { DistrictsService } from '../../../../../../../../service/locations/districts-service';
import { CityRequestDTO } from '../../../../../../../../service/locations/cities-service';

export interface District {
  propertyId: string;
  name: string;
}

@Component({
  selector: 'app-update-cites',
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
  templateUrl: './update-cites.html',
  standalone: true,
  styleUrl: './update-cites.scss'
})
export class UpdateCities implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  districts: District[] = [];
  filteredDistricts: Observable<District[]>;
  searchDistrict: string = '';
  selectedDistrict: District | null = null;
  selectedDistrictId: string = "";
  cityData: any;
  private initialFormValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private citiesService: CitiesService,
    private districtsService: DistrictsService,
    private dialogRef: MatDialogRef<UpdateCities>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cityData = data;
    console.log('city data', this.cityData);

    this.slotForm = this.createForm();
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
    this.patchCityData();
    this.getAllCategories();
    this.initialFormValue = this.slotForm.value;
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      districtName: ['', [Validators.required]],
      cityName: ['', [Validators.required]],
    });
  }

  private patchCityData(): void {
    if (this.cityData) {
      this.slotForm.patchValue({
        cityName: this.cityData.city,
        districtName:this.cityData.district ,
      });
      this.setDistrict();
    }
  }

  setDistrict(){
    this.districtsService.searchDistricts(this.cityData.district, 0, 1).subscribe({
      next: (response) => {
        this.selectedDistrictId = response?.data?.dataList[0]?.propertyID;
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  displayFn(district: District | string): string {
    if (typeof district === 'string') {
      return district;
    }
    return district && district.name ? district.name : '';
  }

  onCategorySelected(district: District): void {
    this.selectedDistrict = district;
    this.selectedDistrictId = (district as any).propertyID || district.propertyId;
  }

  getAllCategories() {
    this.isLoading = true;
    this.districtsService.searchDistricts(this.searchDistrict, 0, 5).subscribe({
      next: (response) => {
        if (response && response.data && response.data.dataList) {
          this.districts = response.data.dataList;
        } else {
          this.districts = response.dataList || [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.districts = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load categories');
      }
    });
  }

  onSave(): void {
    if (this.slotForm.valid) {
      if ( !this.selectedDistrictId) {
        this.snackbarService.openWarning('Please select a valid district from the list');
        return;
      }
      this.isLoading = true;
      const formValue = this.slotForm.value;
      const dto: CityRequestDTO = {
        name: formValue.cityName,
        districtId: this.selectedDistrictId
      };
      this.citiesService.updateCity(this.cityData.propertyID, dto).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.snackbarService.openWarning('City updated successfully!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error updating city:', error);
          this.snackbarService.openWarning(error.error?.message || 'Failed to update city');
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

  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.slotForm.value);
  }
}
