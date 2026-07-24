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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConformation } from '../../../../../core/delete-conformation/delete-conformation';
import { CitiesService } from '../../../../../../service/locations/cities-service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NewCites } from './inner-items/new-cites/new-cites';
import { UpdateCities } from './inner-items/update-cites/update-cites';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cities',
  imports: [
    MatTable,
    MatPaginator,
    ReactiveFormsModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatTooltipModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow,
    MatButtonModule
  ],
  templateUrl: './cities.html',
  standalone: true,
  styleUrl: './cities.scss'
})
export class Cities implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  searchText = '';
  totalElements = 0;
  displayedColumns: string[] = ['position', 'district', 'city', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  searchControl = new FormControl('');

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbarService: SnackbarService,
    private citiesService: CitiesService
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    setTimeout(() => {
      this.loadAll();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.searchText = searchValue?.trim() || '';
      this.page = 0;
      this.loadAll();
    });
  }

  loadAll(): void {
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    });

    this.citiesService.searchCities(this.searchText, this.page, this.size).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.loading = false;
          if (response.code === 200 && response.data) {
            const mappedData = response.data.dataList.map((item: any, index: number) => ({
              ...item,
              position: index + 1 + (this.page * this.size)
            }));
            this.dataSource.data = mappedData;
            this.totalElements = response.data.count;
            this.dataSource.paginator = this.paginator;
          } else {
            this.dataSource.data = [];
            this.totalElements = 0;
          }
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.loading = false;
          console.error('Error loading cities:', error);
          this.snackbarService.openWarning(error.error?.message || 'Failed to load cities');
          this.dataSource.data = [];
          this.totalElements = 0;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadAll();
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(NewCites, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  updateUser(city: any): void {
    const dialogUpdateRef = this.matDialog.open(UpdateCities, {
      width: '600px',
      disableClose: false,
      data: city
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  deleteUser(city: any): void {
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(city.propertyID);
      }
    });
  }

  delete(cityId: string): void {
    this.citiesService.deleteCity(cityId).subscribe({
      next: (response) => {
        this.loadAll();
        this.snackbarService.openSuccess(response.message);
      },
      error: (error) => {
        console.error('Error deleting city:', error);
        this.snackbarService.openWarning(error.error?.message || 'Failed to delete city');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
