import { Component, OnInit ,ChangeDetectorRef  } from '@angular/core';
import { DashboardCards } from './inner/dashboard-cards/dashboard-cards';
import { RevenueTrend } from './inner/revenue-trend/revenue-trend';
import { AdCategory } from './inner/ad-category/ad-category';
import { RunningAds } from './inner/running-ads/running-ads';
import { DashboardStatisticService } from '../../../../service/dashboardStatistics/dashboard-statistic-service';
import { SnackbarService } from '../../../../service/snackbar/snackbar.service';

@Component({
  selector: 'app-dashboard-default',
  imports: [
    DashboardCards,
    RevenueTrend,
    AdCategory,
    RunningAds
  ],
  templateUrl: './dashboard-default.html',
  standalone: true,
  styleUrl: './dashboard-default.scss'
})
export class DashboardDefault implements OnInit {


  cardData:any;

  constructor(
    private dashboardStatisticService: DashboardStatisticService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllStatistics();
  }

  getAllStatistics() {
    this.dashboardStatisticService.getDashboardStats().subscribe({
      next: (response) => {
        // console.log('dashboard res', response.data);
        setTimeout(() => {
          this.cardData = response?.data;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while loading statistics');
      }
    });
  }
}
