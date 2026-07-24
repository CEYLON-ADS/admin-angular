import {Component, Inject, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AdvertisementSlotService } from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';
import { CategoryService } from '../../../../../../../../service/category/category-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { AdvertisementSlotRequestDTO } from '../../../../../../../../dto/AdvertisementSlotRequestDTO';
import {ProgressSpinner} from '../../../../../../../core/progress-spinner/progress-spinner';

export interface Category {
  propertyId: string;
  categoryName: string;
  activeStatus: boolean;
}


@Component({
  selector: 'app-update-advertise-slot',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    NgForOf,
  ],
  templateUrl: './update-advertise-slot.html',
  standalone: true,
  styleUrl: './update-advertise-slot.scss'
})
export class UpdateAdvertiseSlot implements OnInit {

  slotForm: FormGroup;
  isLoading = false;
  categories: Category[] = [];
  slot:any;
  initialFormValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private advertisementSlotService: AdvertisementSlotService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<UpdateAdvertiseSlot>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slot = data;
    this.slotForm = this.createForm();

    this.createForm()
  }

  ngOnInit(): void {

    // console.log('slot',  this.slot );

    this.getAllCategories();

    // Patch the form with initial values
    this.slotForm.patchValue({
      slotNumber:this.slot.slotNumber,
      estimateCost:this.slot.estimateCost,
      categoryId: this.slot.categoryId
    });

    // Store the initial form value after patching
    this.initialFormValue = this.slotForm.value;

  }

  // Method to check if form has changed
  get hasFormChanged(): boolean {
    return JSON.stringify(this.slotForm.value) !== JSON.stringify(this.initialFormValue);
  }

  // Method to check if update button should be disabled
  get isUpdateDisabled(): boolean {
    return !this.slotForm.valid || !this.hasFormChanged || this.isLoading;
  }


  private createForm(): FormGroup {
    return this.formBuilder.group({
      slotNumber: ['', [Validators.required, Validators.minLength(2)]],
      estimateCost: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, [Validators.required]]
    });
  }

  getAllCategories() {
    this.isLoading = true; // Set loading state

    this.categoryService.searchCategories('', 0, 1000).subscribe({
      next: (response) => {
        // console.log('Full response:', response);

        // Handle different possible response structures
        if (response && response.body && response.body.data && response.body.data.dataList) {
          this.categories = response.body.data.dataList;
        } else if (response && response.data && response.data.dataList) {
          this.categories = response.data.dataList;
        } else {
          this.categories = response.dataList || [];
        }

        this.isLoading = false;
        this.cdr.detectChanges();

        // console.log('Categories loaded:', this.categories);
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
        slotNumber: formValue.slotNumber,
        estimateCost: Number(formValue.estimateCost),
        categoryId: formValue.categoryId
      };

      this.advertisementSlotService.updateSlot(this.slot.propertyId,slotRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.dialogRef.close(true);
          this.snackbarService.openSuccess(response.message);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error creating slot request:', error);
          this.snackbarService.openWarning(error.error.message);
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
