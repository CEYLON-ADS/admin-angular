// country.component.ts
import {Component, OnInit, OnDestroy, inject, ChangeDetectorRef} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { CountriesService } from '../../../../../../service/locations/countries-service';
import { AvailableCountriesToolBar } from './available-countries-tool-bar/available-countries-tool-bar';
import { AvailableCountriesAvStateManager } from './available-countries-av-state-manager/available-countries-av-state-manager';

// Interfaces for better typing
interface Country {
  propertyId: string;
  countryName: string;
  dialCode: string;
  currencyName: string;
  currencySymbol: string;
  activeStatus: boolean;
  createdDate: string;
}

interface CountryResponse {
  data: {
    dataList: Country[];
    count: number;
  };
  code: number;
  message?: string;
}

interface PaginationConfig {
  page: number;
  size: number;
  searchText: string;
}

@Component({
  selector: 'app-country',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatButton,
    AvailableCountriesToolBar,
    NgForOf,
    AvailableCountriesAvStateManager,
    DatePipe,
    NgxSkeletonLoaderComponent,
    NgIf,
    MatPaginator,
    MatIconButton
  ],
  templateUrl: './country.html',
  styleUrl: './country.scss'
})
export class CountryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private cf:ChangeDetectorRef = inject(ChangeDetectorRef);

  // Loading and error states
  loading = false;
  error: string | null = null;

  // Pagination and data
  paginationConfig: PaginationConfig = {
    page: 0,
    size: 10,
    searchText: ''
  };

  countries: Country[] = [];
  totalCount = 0;

  // Form
  searchForm: FormGroup = new FormGroup({
    searchText: new FormControl('')
  });

  // Pagination options
  readonly pageSizeOptions = [10, 30, 60, 100];

  // Skeleton loader config
  readonly skeletonConfig = {
    count: 5,
    animation: 'progress-dark' as const,
    theme: {
      'border-radius': '5px',
      height: '40px',
      'background-color': '#ecf0f1',
    }
  };

  constructor(
    private snackbarService: SnackbarService,
    private countryService: CountriesService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.loadCountries();
  }

  private setupSearchSubscription(): void {
    this.searchForm.get('searchText')?.valueChanges
      .pipe(
        debounceTime(500), // Reduced debounce time for better UX
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchText => {
        this.paginationConfig.searchText = searchText || '';
        this.paginationConfig.page = 0; // Reset to first page on search
        this.loadCountries();
        this.cf.detectChanges();
      });
  }

  onPageChange(pageEvent: PageEvent): void {
    this.paginationConfig.page = pageEvent.pageIndex;
    this.paginationConfig.size = pageEvent.pageSize;
    this.loadCountries();
  }

  onRefreshTable(): void {
    this.loadCountries();
  }

  onAddNewCountry(): void {
    // Emit event to parent or navigate to add country page
    // This depends on your routing/modal implementation
    console.log('Add new country clicked');
    // Example: this.router.navigate(['/countries/add']);
    // Or: this.openAddCountryModal();
  }

  private loadCountries(): void {
    this.loading = true;
    this.error = null;
    this.countries = [];

    const { searchText, page, size } = this.paginationConfig;

    this.countryService.loadCountries(searchText, page, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: CountryResponse) => {
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.handleErrorResponse(error);
        }
      });
  }

  private handleSuccessResponse(response: CountryResponse): void {
    this.loading = false;

    if (response.code==200 && response.data) {
      this.countries = response.data.dataList || [];
      this.totalCount = response.data.count || 0;
      this.cf.detectChanges();
    } else {
      this.handleError('Failed to load countries: ' + (response.message || 'Unknown error'));
    }
  }

  private handleErrorResponse(error: any): void {
    this.loading = false;
    const errorMessage = error?.error?.message || error?.message || 'Failed to load countries';
    this.handleError(errorMessage);
  }

  private handleError(message: string): void {
    this.error = message;
    this.snackbarService.openWarning(message, 'error');
    this.countries = [];
    this.totalCount = 0;
  }

  // Helper methods for template
  get hasCountries(): boolean {
    return this.countries.length > 0;
  }

  get showEmptyState(): boolean {
    return !this.loading && !this.hasCountries && !this.error;
  }

  get showAddButton(): boolean {
    return this.showEmptyState || (!this.loading && this.countries.length === 0);
  }

  getDisplayIndex(index: number): number {
    return (this.paginationConfig.page * this.paginationConfig.size) + index + 1;
  }

  onCopyIndex(index: number): void {
    const displayIndex = this.getDisplayIndex(index);
    navigator.clipboard.writeText(displayIndex.toString()).then(() => {
      this.snackbarService.openSuccess('Index copied to clipboard', 'success');
    });
  }
}
