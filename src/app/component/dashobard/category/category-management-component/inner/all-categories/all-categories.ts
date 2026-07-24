import { Component, inject, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { NewCategory } from '../new-category/new-category';
import { CategoryService } from '../../../../../../service/category/category-service';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { ChangeCategoryState } from './inner-items/change-category-state/change-category-state';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConformation } from '../../../../../core/delete-conformation/delete-conformation';
import { UpdateCategory } from './inner-items/update-category/update-category';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.html',
  standalone: true,
  imports: [
    MatTable,
    MatPaginator,
    FormsModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    ChangeCategoryState,
    MatTooltipModule,
    NgIf,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow
  ],
  styleUrls: ['./all-categories.scss']
})
export class AllCategories implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  totalItems = 0;
  searchText = '';
  displayedColumns: string[] = ['position', 'categoryName', 'activeStatus', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Subscribe to search subject with debounce
    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.searchText = searchValue.trim();
      this.page = 0; // Reset to first page on search
      this.loadAll();
    });

    this.loadAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges(); // Ensure paginator is initialized
  }

  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading spinner
    this.categoryService.searchCategories(this.searchText, this.page, this.size).subscribe({
      next: (response) => {
        const mappedData: any[] = response.body.data.dataList.map((item: any, index: number) => ({
          ...item,
          position: this.page * this.size + index + 1
        }));
        this.totalItems = response.body.data.count;
        this.dataSource.data = mappedData;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection after data update
      },
      error: (error) => {
        this.loading = false;
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(NewCategory, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0; // Reset to first page after adding new category
        this.loadAll();
      }
    });
  }

  changedStatus(): void {
    this.loadAll();
  }

  updateCategory(category: any): void {
    const dialogUpdateRef = this.matDialog.open(UpdateCategory, {
      width: '600px',
      disableClose: false,
      data: category
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  deleteCategory(category: any): void {
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(category.propertyId);
      }
    });
  }

  delete(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess(response.body.message);
        this.page = 0; // Reset to first page after deletion
        this.loadAll();
      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
