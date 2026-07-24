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
import { AdvertisementSlotService } from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';
import { CategoryService } from '../../../../../../../../service/category/category-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { AdvertisementSlotRequestDTO } from '../../../../../../../../dto/AdvertisementSlotRequestDTO';

export interface Category {
  propertyId: string;
  categoryName: string;
  activeStatus: boolean;
}

@Component({
  selector: 'app-new-advertisement-slot',
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
  templateUrl: './new-advertisement-slot.html',
  standalone: true,
  styleUrl: './new-advertisement-slot.scss'
})
export class NewAdvertisementSlot implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  categories: Category[] = [];
  filteredCategories: Observable<Category[]>;
  searchCategory: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private advertisementSlotService: AdvertisementSlotService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<NewAdvertisementSlot>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slotForm = this.createForm();
    this.filteredCategories = this.slotForm.get('categoryName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        this.searchCategory = typeof value === 'string' ? value : value?.categoryName || '';
        return this.categoryService.searchCategories(this.searchCategory, 0, 5).pipe(
          map(response => {
            if (response && response.body && response.body.data && response.body.data.dataList) {
              return response.body.data.dataList;
            } else if (response && response.data && response.data.dataList) {
              return response.data.dataList;
            }
            return response.dataList || [];
          })
        );
      })
    );
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      slotNumber: ['', [Validators.required, Validators.minLength(2)]],
      estimateCost: [null, [Validators.required, Validators.min(0.01)]],
      categoryName: ['', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category =>
      category.categoryName.toLowerCase().includes(filterValue)
    );
  }

  onCategorySelected(category: Category): void {
    this.slotForm.patchValue({
      categoryName: category.categoryName,
      categoryId: category.propertyId
    });
  }

  displayFn(category: Category | string): string {
    if (typeof category === 'string') {
      return category;
    }
    return category && category.categoryName ? category.categoryName : '';
  }

  getAllCategories() {
    this.isLoading = true;

    this.categoryService.searchCategories(this.searchCategory, 0, 5).subscribe({
      next: (response) => {
        if (response && response.body && response.body.data && response.body.data.dataList) {
          this.categories = response.body.data.dataList;
        } else if (response && response.data && response.data.dataList) {
          this.categories = response.data.dataList;
        } else {
          this.categories = response.dataList || [];
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load categories');
      }
    });
  }

  onSave(): void {
    if (this.slotForm.valid) {
      this.isLoading = true;

      const formValue = this.slotForm.value;
      const slotRequest: AdvertisementSlotRequestDTO = {
        slotNumber: formValue.slotNumber.trim(),
        estimateCost: Number(formValue.estimateCost),
        categoryId: formValue.categoryId
      };

      this.advertisementSlotService.createSlot(slotRequest).subscribe({
        next: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error creating slot request:', error);
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
