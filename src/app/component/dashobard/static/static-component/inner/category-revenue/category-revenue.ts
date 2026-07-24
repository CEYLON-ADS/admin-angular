import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { FormsModule } from "@angular/forms";

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
  selector: 'app-category-revenue',
  standalone: true,
  imports: [ChartComponent, NgApexchartsModule, FormsModule],
  templateUrl: './category-revenue.html',
  styleUrls: ['./category-revenue.scss']
})
export class CategoryRevenue implements OnInit {
  @ViewChild("chart") chart: ChartComponent | any;

  private _category: any;
  @Input()
  set category(value: any) {
    this._category = value;
    if (value) this.loadRevenueData();
  }
  get category(): any {
    return this._category;
  }

  startDate: string;
  endDate: string;

  public chartOptions: ChartOptions;

  constructor(
    private revenueService: RevenueService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];

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
    // Do nothing here, chart load is triggered by category setter
  }

  loadRevenueData() {
    if (!this.category) return;

    this.revenueService.getRevenue(
      this.category.propertyId,
      this.startDate,
      this.endDate
    ).subscribe({
      next: (response: any) => {
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
      },
      error: (error) => console.error('Error loading revenue:', error)
    });
  }

  onDateChange() {
    this.loadRevenueData();
  }
}
