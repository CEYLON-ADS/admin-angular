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
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../../../../../../../service/category/category-service';
import {CategoryRequestDTO} from '../../../../../../../../dto/category-request-dto';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {ProgressSpinner} from '../../../../../../../core/progress-spinner/progress-spinner';
import {NgClass} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-update-category',
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
    NgClass
  ],
  templateUrl: './update-category.html',
  standalone: true,
  styleUrl: './update-category.scss'
})
export class UpdateCategory implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  category: any;
  initialFormValue: any; // Store the initial form value

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<UpdateCategory>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.category = data;

    this.form = this.fb.group({
      categoryName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('update category', this.category);

    // Patch the form with initial values
    this.form.patchValue({
      categoryName: this.category.categoryName
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

  updateCategory() {
    if (this.form.valid && this.hasFormChanged) {
      this.loading = true;

      const dto: CategoryRequestDTO = {
        categoryName: this.form.value.categoryName
      }

      this.categoryService.updateCategory(this.category.propertyId, dto).subscribe({
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
