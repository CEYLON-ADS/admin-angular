import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NewDistricts} from './inner-items/new-districts/new-districts';
import {MatDialog} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {District, DistrictsService} from '../../../../../../service/locations/districts-service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {UpdateDistrict} from './inner-items/update-district/update-district';
import {DeleteConformation} from '../../../../../core/delete-conformation/delete-conformation';
import {SnackbarService} from '../../../../../../service/snackbar/snackbar.service';
import {NewCites} from '../cities/inner-items/new-cites/new-cites';

@Component({
  selector: 'app-districts',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatTooltip,
    NgIf
  ],
  templateUrl: './districts.html',
  standalone: true,
  styleUrl: './districts.scss'
})
export class Districts implements  OnInit, AfterViewInit {
private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: District[] = [];

  private readonly matDialog = inject(MatDialog);

  // Pagination
@ViewChild(MatPaginator) paginator!: MatPaginator;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50];

  // Search
  searchControl = new FormControl('');
  searchText = '';

  // Loading state
  loading = false;

  constructor(
    private dialog: MatDialog,
    private districtsService: DistrictsService,
    private snackBar: MatSnackBar,
    private snackbarService:SnackbarService
) {}

  ngOnInit(): void {
    this.setupSearch();
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
    this.loadDistricts();
  });
}

  ngAfterViewInit(): void {
    // Remove the manual change detection call from here
    // this.cdr.detectChanges(); // Remove this line
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchValue => {
        this.searchText = searchValue || '';
        this.pageIndex = 0; // Reset to first page on search
        this.loadDistricts();
      });
  }

  loadDistricts(): void {
    // Use setTimeout to avoid change detection issues
    setTimeout(() => {
    this.loading = true;
    this.cdr.detectChanges();
  });

  this.districtsService.searchDistricts(this.searchText, this.pageIndex, this.pageSize)
    .subscribe({
      next: (response) => {
        setTimeout(() => {
          this.loading = false;
          if (response.code === 200 && response.data) {
            const paginatedData = response.data;
            this.dataSource = paginatedData.dataList;
            this.totalElements = paginatedData.count;
          } else {
            this.dataSource = [];
            this.totalElements = 0;
          }
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.loading = false;
          console.error('Error loading districts:', error);
          this.snackBar.open('Error loading districts', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.dataSource = [];
          this.totalElements = 0;
          this.cdr.detectChanges();
        });
      }
    });
}

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDistricts();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  openAddDistrictDialog(): void {
    const dialogRef = this.dialog.open(NewDistricts, {
      width: '450px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('District created:', result);
        this.snackBar.open('District created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Refresh the list
        this.loadDistricts();
      }
    });
  }

  // Future methods for edit/delete
  editDistrict(district: District): void {
    console.log('Edit district:', district);
    const dialogUpdateRef = this.matDialog.open(UpdateDistrict, {
      width: '600px',
      disableClose: false,
      data:district
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDistricts();
      }
    });
  }

  deleteDistrict(district:any): void {
    console.log( 'district',district );
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(district.propertyID);
      }
      else{
        console.log('result false');
      }
    });
  }

  delete(id:string): void {
    this.districtsService.deleteDistrict(id).subscribe({
      next: (response) => {
        // console.log('res', response);
        this.loadDistricts();
        this.snackbarService.openSuccess(response.message);
      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
      }
    });
  }

  setCities(row:any) {
  this.matDialog.open(NewCites, {
      width: '500px',
      disableClose: false,
      data:{propertyId:row.propertyID}
    });

  }
}




