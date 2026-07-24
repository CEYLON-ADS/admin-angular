import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../../../../../service/category/category-service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  NgApexchartsModule
} from "ng-apexcharts";
import { RevenueService } from '../../../../../../service/revenue/revenue-service';
import { SnackbarService } from '../../../../../../service/snackbar/snackbar.service';
import { FormsModule } from "@angular/forms";
import { NgForOf } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-revenue-trend',
  standalone: true,
  imports: [
    ChartComponent,
    NgApexchartsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './revenue-trend.html',
  styleUrls: ['./revenue-trend.scss']
})
export class RevenueTrend implements OnInit {
  @ViewChild("chart") chart: ChartComponent | any;

  startDate: string;
  endDate: string;

  categories: any[] = [];
  selectedCategory: any = null;

  public chartOptions: ChartOptions;

  constructor(
    private revenueService: RevenueService,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {
    // Initialize startDate and endDate to current month's first and last day
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];

    // Initial dummy chart
    this.chartOptions = {
      series: [{ name: "Revenue", data: [] }],
      chart: { height: 350, type: "line", zoom: { enabled: true } },
      dataLabels: { enabled: false },
      stroke: { width: 3, curve: "straight" },
      title: { text: "Advertisement Revenue", align: "left" },
      markers: { size: 4 },
      xaxis: { categories: [], labels: { rotate: -45, rotateAlways: true } },
      yaxis: { title: { text: "Revenue (LKR)" } },
      legend: { show: true, position: "top" },
      grid: { borderColor: "#f1f1f1" },
      tooltip: { y: { formatter: (val: number) => `${val} LKR` } }
    };
  }

  ngOnInit(): void {
    this.categoryGetAll();
    console.log('read' );
  }

  getRevenueData() {
    if (!this.selectedCategory) return;

    this.revenueService.getRevenue(
      this.selectedCategory.propertyId,
      this.startDate,
      this.endDate
    ).subscribe({
      next: (response: any) => {
        console.log('revenue data', response);

        const revenueData = response?.data || [];
        const dates = revenueData.map((item: any) => item.date);
        const revenues = revenueData.map((item: any) => item.revenue);

        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: "Revenue", data: revenues }],
          xaxis: { ...this.chartOptions.xaxis, categories: dates }
        };

        setTimeout(() => {
          this.changeDetectorRef.detectChanges();
        }, 200);


        // this.snackbarService.openSuccess(response?.message ?? "Revenue loaded");
      },
      error: (error) => {
        console.error('error', error);
        // this.snackbarService.openWarning("An error occurred while loading revenue");
      }
    });
  }

  categoryGetAll() {
    this.categoryService.searchCategories("", 0, 100).subscribe({
      next: (response: any) => {
        this.categories = response?.body?.data?.dataList || [];
        console.log("categories", response);

        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
          this.getRevenueData();
        }

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('error', error);
      }
    });
  }
}
