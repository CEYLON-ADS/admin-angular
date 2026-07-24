import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoryService } from '../../../../../../../../service/category/category-service';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';

@Component({
  selector: 'app-change-category-state',
  imports: [MatSlideToggleModule],
  templateUrl: './change-category-state.html',
  styleUrl: './change-category-state.scss',
  standalone: true
})
export class ChangeCategoryState implements OnInit {
  @Input() category: any;
  @Output() statusChanged = new EventEmitter<void>(); // Emit new status to parent

  loading = false; // Optional: show loading while API call

  constructor(
    private categoryService: CategoryService,
    private snackbarService:SnackbarService

  ) {}

  ngOnInit(): void {
    console.log('category', this.category);
  }

  toggleStatus() {
    const newStatus = !this.category.activeStatus;
    this.loading = true;

    this.categoryService.changeCategoryStatus(this.category.propertyId, newStatus).subscribe({
      next: (response) => {
        this.category.activeStatus = newStatus;
        this.snackbarService.openSuccess(response.body.message);
        this.statusChanged.emit();
        this.loading = false;
      },
      error: (error) => {
        console.error('error', error);
        this.loading = false;
        this.snackbarService.openWarning(error.error.message);
      }
    });
  }



}
