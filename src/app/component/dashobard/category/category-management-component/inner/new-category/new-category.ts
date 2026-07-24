import {Component, Inject} from '@angular/core';
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
import {CategoryService} from '../../../../../../service/category/category-service';
import {CategoryRequestDTO} from '../../../../../../dto/category-request-dto';
import {SnackbarService} from '../../../../../../service/snackbar/snackbar.service';
import {ProgressSpinner} from '../../../../../core/progress-spinner/progress-spinner';
import {NgClass, NgIf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-new-category',
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
  templateUrl: './new-category.html',
  standalone: true,
  styleUrl: './new-category.scss'
})
export class NewCategory {
  form: FormGroup;
  loading:boolean = false;


  constructor(
    private fb: FormBuilder ,
    private categoryService:CategoryService,
    private snackbarService:SnackbarService,
    public dialogRef: MatDialogRef<NewCategory>,
    @Inject(MAT_DIALOG_DATA) public data: any
    )
  {

    this.form = this.fb.group({
      categoryName: ['' ,Validators.required]
    });
  }


  uploadCategory() {
    if(this.form.valid){

      this.loading = true;

      const dto:CategoryRequestDTO = {
        categoryName : this.form.value.categoryName
      }

      this.categoryService.createCategory(dto).subscribe({
        next: (response) => {
          // console.log('response')
          this.loading = false;
          this.snackbarService.openSuccess(response.body.message);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('error', error);
          this.loading = false;
          this.snackbarService.openWarning(error.error.message);
          // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: error?.error?.message });
        }
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
}
