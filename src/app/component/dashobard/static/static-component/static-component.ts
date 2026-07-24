import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CategoryService } from '../../../../service/category/category-service';
import { SnackbarService } from '../../../../service/snackbar/snackbar.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { CategoryRevenue } from './inner/category-revenue/category-revenue';

@Component({
  selector: 'app-static-component',
  imports: [
    NgForOf,
    NgIf,
    CategoryRevenue,
    NgClass
  ],
  templateUrl: './static-component.html',
  standalone: true,
  styleUrl: './static-component.scss'
})
export class StaticComponent implements OnInit {
  categories: any[] = [];
  selectedCategory: any = null;

  constructor(
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private changeDetectorRef:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryGetAll();
  }

  categoryGetAll() {
    this.categoryService.searchCategories("", 0, 100).subscribe({
      next: (response) => {
        this.categories = response.body.data.dataList;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (error) => {
        console.error('error', error);
      }
    });
  }

  onCategoryClick(category: any) {
    // console.log('click' );
    this.selectedCategory = category;
    this.changeDetectorRef.detectChanges();
  }
}
