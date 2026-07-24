import { Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { NewCategory} from '../../../../category/category-management-component/inner/new-category/new-category';
import { CategoryService } from '../../../../../../service/category/category-service';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import {SnackbarService} from '../../../../../../service/snackbar/snackbar.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DeleteConformation} from '../../../../../core/delete-conformation/delete-conformation';
import {UpdateCategory} from '../../../../category/category-management-component/inner/all-categories/inner-items/update-category/update-category';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-ad-category',
  imports: [
    MatTable,
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
    MatTooltipModule
  ],
  templateUrl: './ad-category.html',
  standalone: true,
  styleUrl: './ad-category.scss'
})
export class AdCategory implements OnInit, OnDestroy {

  private readonly matDialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  searchText = '';
  displayedColumns: string[] = ['position', 'categoryName'];
  dataSource = new MatTableDataSource<any>([]);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private snackbarService:SnackbarService
  ) {}

  ngOnInit(): void {
    // Subscribe to search subject with debounce
    this.searchSubject.pipe(
      debounceTime(500), // wait 500ms after the last keypress
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.searchText = searchValue.trim();
      this.loadAll();
    });

    this.loadAll();
  }

  // Call this on input change
  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  loadAll(): void {
    this.categoryService.searchCategories(this.searchText, this.page, this.size).subscribe({
      next: (response) => {
        // console.log('res', response);

        const mappedData: any[] = response.body.data.dataList.map((item: any, index: number) => ({
          ...item,
          position: index + 1
        }));

        this.dataSource.data = mappedData;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
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
        this.loadAll();
      }
    });
  }

  changedStatus(){
    this.loadAll();
  }

  updateCategory(category:any) : void {
    const dialogUpdateRef = this.matDialog.open(UpdateCategory, {
      width: '600px',
      disableClose: false,
      data:category
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  deleteCategory(category:any){
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('result true');
        this.delete(category.propertyId)
        this.snackbarService.openSuccess(result.body.message);
      }
      else{
        // console.log('result false');
      }
    });
  }

  delete(categoryId:string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response) => {
        // console.log('res', response);
        this.snackbarService.openSuccess(response.body.message);
        this.loadAll();

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
