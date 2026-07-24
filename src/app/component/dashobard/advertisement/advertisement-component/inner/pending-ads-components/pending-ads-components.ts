import { AfterViewInit, Component, inject, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConformation } from '../../../../../core/delete-conformation/delete-conformation';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { GeneralAdvertisementService } from '../../../../../../service/GeneralAdvertisement/general-advertisement';
import { TruncatePipePipe } from '../../../../../../pipe/truncate-pipe-pipe';
import { ViewPendingAdd } from './inner-items/view-pending-add/view-pending-add';

@Component({
  selector: 'app-pending-ads-components',
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
    MatTooltipModule,
    NgIf,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow,
    TruncatePipePipe
  ],
  templateUrl: './pending-ads-components.html',
  standalone: true,
  styleUrls: ['./pending-ads-components.scss']
})
export class PendingAdsComponents implements OnInit, AfterViewInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  totalItems = 0;
  searchText = '';
  displayedColumns: string[] = ['position', 'userContact', 'categoryName', 'title', 'activeState', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbarService: SnackbarService,
    private generalAdvertisementService: GeneralAdvertisementService
  ) {}

  ngOnInit(): void {
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
    this.generalAdvertisementService.searchUnverifiedAdvertisements(this.searchText, this.page, this.size).subscribe({
      next: (response) => {
        const dataList = response.data?.dataList || [];
        const mappedData: any[] = Array.isArray(dataList) ? dataList.map((item: any, index: number) => ({
          ...item,
          position: this.page * this.size + index + 1
        })) : [];
        this.totalItems = response.data?.count || 0; // Update totalItems from response
        this.dataSource.data = mappedData;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection after data update
      },
      error: (error) => {
        this.loading = false;
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while fetching advertisements');
        this.dataSource.data = []; // Clear data on error to trigger no-data row
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  openViewDialog(slot: any): void {
    const dialogRef = this.matDialog.open(ViewPendingAdd, {
      width: '600px',
      disableClose: false,
      data: slot
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0; // Reset to first page after view action
        this.loadAll();
      }
    });
  }

  deleteSlot(ad: any): void {
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(ad.propertyId);
      }
    });
  }

  delete(propertyId: string): void {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading spinner
    this.generalAdvertisementService.deleteAdvertisement(propertyId).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess("Advertisement deleted successfully");
        this.page = 0; // Reset to first page after deletion
        this.loadAll();
      },
      error: (error) => {
        this.loading = false;
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while deleting the advertisement');
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
