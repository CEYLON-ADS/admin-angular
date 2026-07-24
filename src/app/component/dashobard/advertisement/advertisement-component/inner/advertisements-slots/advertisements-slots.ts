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
import { AdvertisementSlotService } from '../../../../../../service/advertisement-slot/advertisement-slot-service';
import { NewAdvertisementSlot } from './inner-items/new-advertisement-slot/new-advertisement-slot';
import { AdvertisementSlotState } from './inner-items/advertisement-slot-state/advertisement-slot-state';
import { AdvertisementSlotAvailabilityState } from './inner-items/advertisement-slot-availability-state/advertisement-slot-availability-state';
import { UpdateAdvertiseSlot } from './inner-items/update-advertise-slot/update-advertise-slot';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-advertisements-slots',
  templateUrl: './advertisements-slots.html',
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
    MatTooltipModule,
    NgIf,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow,
    AdvertisementSlotState,
    AdvertisementSlotAvailabilityState,
    DecimalPipe
  ],
  styleUrls: ['./advertisements-slots.scss']
})
export class AdvertisementsSlots implements OnInit, AfterViewInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  totalItems = 0;
  searchText = '';
  displayedColumns: string[] = ['position', 'categoryName', 'slotNumber', 'estimateCost', 'availability', 'activeState', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbarService: SnackbarService,
    private advertisementSlotService: AdvertisementSlotService
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
    this.advertisementSlotService.searchSlots(this.searchText, this.page, this.size).subscribe({
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
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while fetching advertisement slots');
        this.dataSource.data = []; // Clear data on error to trigger no-data row
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(NewAdvertisementSlot, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0; // Reset to first page after adding new slot
        this.loadAll();
      }
    });
  }

  changedStatus(): void {
    this.page = 0; // Reset to first page after status change
    this.loadAll();
  }

  updateSlot(slot: any): void {
    const dialogUpdateRef = this.matDialog.open(UpdateAdvertiseSlot, {
      width: '600px',
      disableClose: false,
      data: slot
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0; // Reset to first page after update
        this.loadAll();
      }
    });
  }

  deleteSlot(slot: any): void {
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(slot.propertyId);
      }
    });
  }

  delete(propertyId: string): void {
    this.loading = true;
    this.cdr.detectChanges(); // Force change detection for loading spinner
    this.advertisementSlotService.deleteSlot(propertyId).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess("Advertisement slot deleted successfully");
        this.page = 0; // Reset to first page after deletion
        this.loadAll();
      },
      error: (error) => {
        this.loading = false;
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while deleting the slot');
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
