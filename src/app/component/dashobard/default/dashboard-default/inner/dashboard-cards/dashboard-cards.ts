import {Component, Input, OnChanges, OnInit, SimpleChanges , ChangeDetectorRef} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  change: number;
  changeText: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
  isPositive: boolean;
}
@Component({
  selector: 'app-dashboard-cards',
  imports: [
    MatIcon,
    NgIf
  ],
  templateUrl: './dashboard-cards.html',
  standalone: true,
  styleUrl: './dashboard-cards.scss'
})
export class DashboardCards implements OnInit , OnChanges {

@Input() data:any



  constructor(
    private changeDetectorRef:ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    // Simulate data loading with animation trigger
    setTimeout(() => {
    this.animateNumbers();



  }, 500);
}

  animateNumbers(): void {
    // You can add number animation logic here
    // For now, we'll keep the static values as shown in the design
  }

  getChangeIcon(isPositive: boolean): string {
    return isPositive ? 'trending_up' : 'trending_down';
  }

  trackByTitle(index: number, item: StatCard): string {
    return item.title;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log( 'coming data' , this.data );
    this.changeDetectorRef.detectChanges();
  }
}
