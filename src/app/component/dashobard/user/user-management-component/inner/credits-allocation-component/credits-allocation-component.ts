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
import { UserService } from '../../../../../../service/user/user-service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AllocateCreditsModalComponent } from './inner-items/allocate-credits-modal/allocate-credits-modal';

@Component({
  selector: 'app-credits-allocation-component',
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
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatNoDataRow
  ],
  templateUrl: './credits-allocation-component.html',
  styleUrls: ['./credits-allocation-component.scss']
})
export class CreditsAllocationComponent implements OnInit, OnDestroy {
  private readonly matDialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  public dataSource = new MatTableDataSource<any>([]);
  public displayedColumns: string[] = ['accountId', 'name', 'mobileNumber', 'credits', 'actions'];

  public page = 0;
  public size = 10;
  public count = 0;
  public searchText = '';
  public loading = false;

  // Credit Cost per ad configuration
  public creditCostPerAd: number = 1.0;
  public savingCost: boolean = false;

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((val) => {
        this.searchText = val;
        this.page = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadAdsAgents();
      });

    this.loadCreditCost();
    this.loadAdsAgents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadCreditCost(): void {
    this.userService.getCreditCostPerAd().subscribe({
      next: (res: any) => {
        const cost = res?.body?.data?.creditCostPerAd ?? res?.data?.creditCostPerAd;
        if (cost !== undefined && cost !== null) {
          this.creditCostPerAd = cost;
        }
      },
      error: (err: any) => {
        console.error('Failed to load credit cost per ad:', err);
      }
    });
  }

  public saveCreditCost(): void {
    if (this.creditCostPerAd === null || this.creditCostPerAd === undefined || this.creditCostPerAd < 0) {
      this.snackbarService.openWarning('Please enter a valid credit cost per ad (>= 0)');
      return;
    }

    this.savingCost = true;
    this.userService.setCreditCostPerAd(this.creditCostPerAd).subscribe({
      next: (res: any) => {
        this.savingCost = false;
        this.snackbarService.openSuccess('Credit cost per ad updated successfully');
      },
      error: (err: any) => {
        this.savingCost = false;
        this.snackbarService.openWarning(err?.error?.message || 'Failed to update credit cost');
      }
    });
  }

  public loadAdsAgents(): void {
    this.loading = true;
    this.userService.searchAdsAgents(this.searchText, this.page, this.size).subscribe({
      next: (res: any) => {
        const body = res?.body?.data || res?.data;
        if (body) {
          this.count = body.count || 0;
          this.dataSource.data = body.dataList || [];
        } else {
          this.dataSource.data = [];
          this.count = 0;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.loading = false;
        this.snackbarService.openWarning(err?.error?.message || 'Failed to load Ads Agents');
        this.cdr.markForCheck();
      }
    });
  }

  public pageChanged(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadAdsAgents();
  }

  public openAllocateDialog(user: any): void {
    const dialogRef = this.matDialog.open(AllocateCreditsModalComponent, {
      width: '450px',
      data: {
        userId: user.propertyId,
        username: user.username,
        mobileNumber: user.mobileNumber,
        currentCredits: user.credits || 0
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAdsAgents();
      }
    });
  }
}
