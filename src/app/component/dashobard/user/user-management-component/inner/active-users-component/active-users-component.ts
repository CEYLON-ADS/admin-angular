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
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteConformation } from '../../../../../core/delete-conformation/delete-conformation';
import { UserService } from '../../../../../../service/user/user-service';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateUser } from './inner-items/update-user/update-user';
import { BlackListConformation } from './inner-items/black-list-conformation/black-list-conformation';
import { ViewUser } from './inner-items/view-user/view-user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-active-users-component',
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
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow,
    DatePipe
  ],
  templateUrl: './active-users-component.html',
  standalone: true,
  styleUrls: ['./active-users-component.scss']
})
export class ActiveUsersComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  page = 0;
  size = 10;
  totalItems = 0;
  searchText = '';
  displayedColumns: string[] = ['position', 'mobileNumber', 'createdAt', 'updatedAt', 'tools'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private snackbarService: SnackbarService,
    private userService: UserService
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
    this.userService.searchActiveUsers(this.searchText, this.page, this.size).subscribe({
      next: (response) => {
        const mappedData: any[] = response.body.data.dataList.map((item: any, index: number) => ({
          ...item,
          position: this.page * this.size + index + 1
        }));
        this.totalItems = response.body.data.count; // Update totalItems from response
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

  updateUser(user: any): void {
    const dialogUpdateRef = this.matDialog.open(UpdateUser, {
      width: '600px',
      disableClose: false,
      data: user
    });

    dialogUpdateRef.afterClosed().subscribe(result => {
      if (result) {
        this.page = 0; // Reset to first page after update
        this.loadAll();
      }
    });
  }

  deleteUser(user: any): void {
    const dialogDeleteRef = this.matDialog.open(DeleteConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(user.propertyId);
      }
    });
  }

  delete(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
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

  blackListConformation(user: any): void {
    const dialogBlackListRef = this.matDialog.open(BlackListConformation, {
      width: '500px',
      disableClose: false
    });

    dialogBlackListRef.afterClosed().subscribe(result => {
      if (result) {
        this.blackList(user.propertyId);
      }
    });
  }

  blackList(userId: string): void {
    this.userService.changeUserStatus(userId, false).subscribe({
      next: (response) => {
        this.snackbarService.openSuccess(response.body.message);
        this.page = 0; // Reset to first page after blacklisting
        this.loadAll();
      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error.message);
        this.cdr.detectChanges(); // Force change detection on error
      }
    });
  }

  viewUser(user: any): void {
    this.matDialog.open(ViewUser, {
      width: '500px',
      disableClose: false,
      data: user
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
