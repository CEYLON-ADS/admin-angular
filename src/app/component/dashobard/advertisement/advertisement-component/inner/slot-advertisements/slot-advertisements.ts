import { AfterViewInit, Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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
import { NewCategory } from '../../../../category/category-management-component/inner/new-category/new-category';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { ChangeCategoryState } from '../../../../category/category-management-component/inner/all-categories/inner-items/change-category-state/change-category-state';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConformation } from '../../../../../core/delete-conformation/delete-conformation';
import { UpdateCategory } from '../../../../category/category-management-component/inner/all-categories/inner-items/update-category/update-category';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AdvertisementSlotService } from '../../../../../../service/advertisement-slot/advertisement-slot-service';
import {NewAdvertisementSlot} from '../advertisements-slots/inner-items/new-advertisement-slot/new-advertisement-slot';
import {AdvertisementSlotState} from '../advertisements-slots/inner-items/advertisement-slot-state/advertisement-slot-state';
import {
  AdvertisementSlotAvailabilityState
} from '../advertisements-slots/inner-items/advertisement-slot-availability-state/advertisement-slot-availability-state';
import {UpdateAdvertiseSlot} from '../advertisements-slots/inner-items/update-advertise-slot/update-advertise-slot';
import {NewSlotAdvertisement} from './inner-items/new-slot-advertisement/new-slot-advertisement';
import {SlotAdService} from '../../../../../../service/slot-ad/slot-ad-service';
import {SlotAdvertisementStatus} from './inner-items/slot-advertisement-status/slot-advertisement-status';
import {ViewSlotAdd} from './inner-items/view-slot-add/view-slot-add';
import {UpdateSlotAdvertisement} from './inner-items/update-slot-advertisement/update-slot-advertisement';

@Component({
  selector: 'app-slot-advertisements',
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
    SlotAdvertisementStatus
  ],
  templateUrl: './slot-advertisements.html',
  standalone: true,
  styleUrl: './slot-advertisements.scss'
})
export class SlotAdvertisements implements OnInit, AfterViewInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  searchText = '';
  displayedColumns: string[] = ['position', 'categoryName' , 'slotNumber', 'userContact', 'activeState', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbarService: SnackbarService,
    private advertisementSlotService: AdvertisementSlotService,
    private slotAdService:SlotAdService
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    ).subscribe(searchValue => {
      this.searchText = searchValue.trim();
      this.page = 0;
      this.loadAll();
    });

    this.loadAll();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.page = this.paginator.pageIndex;
      this.size = this.paginator.pageSize;
      this.loadAll();
    });
  }

  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  loadAll(): void {
    this.loading = true;
    this.slotAdService.searchSlotAds(this.searchText, this.page, this.size).subscribe({
      next: (response) => {

        console.log('response ' ,  response );

        // console.log('adv res', response);

        const dataList = response.data?.dataList || [];
        const mappedData: any[] = Array.isArray(dataList) ? dataList.map((item: any, index: number) => ({
          ...item,
          position: index + 1 + (this.page * this.size)
        })) : [];

        this.loading = false;
        this.dataSource.data = mappedData;

        // Set paginator length based on total count
        if (this.paginator && response.data?.count !== undefined) {
          this.paginator.length = response.data.count;
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while fetching advertisement slots');
        this.dataSource.data = []; // Clear data on error to trigger no-data row
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(NewSlotAdvertisement, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  openViewDialog(slot:any): void {
    const dialogRef = this.matDialog.open(ViewSlotAdd, {
      width: '600px',
      disableClose: false,
      data:slot
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  changedStatus(): void {
    this.loadAll();
  }

  updateSlot(slot: any): void {
    console.log('1 slot', slot )
    const dialogUpdateRef = this.matDialog.open(UpdateSlotAdvertisement, {
      width: '600px',
      disableClose: false,
      data: slot
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }

  deleteSlot(slot: any): void {
    console.log( 'slot',slot );
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
    this.slotAdService.deleteSlotAd(propertyId).subscribe({
      next: (response) => {
        this.loadAll();
        this.snackbarService.openSuccess("Advertisement slot deleted successfully");

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while deleting the slot');
      }
    });
  }

  boostAdd(slot:any): void {
    const dialogRef = this.matDialog.open(ViewSlotAdd, {
      width: '600px',
      disableClose: false,
      data:slot
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAll();
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
