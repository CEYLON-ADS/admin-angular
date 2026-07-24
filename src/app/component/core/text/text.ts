import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgForOf} from '@angular/common';
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
  selector: 'app-text',
  imports: [
    MatCard,
    NgForOf,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './text.html',
  styleUrl: './text.scss'
})
export class Text  implements OnInit {
  statsData: StatCard[] = [
    {
      title: 'Total Revenue',
      value: '$0',
      subtitle: 'vs last month',
      change: 12.5,
      changeText: '+12.5%',
      icon: 'attach_money',
      iconColor: '#ffffff',
      iconBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      isPositive: true
    },
    {
      title: 'Active Users',
      value: '0',
      subtitle: 'registered users',
      change: 8.2,
      changeText: '+8.2%',
      icon: 'group',
      iconColor: '#ffffff',
      iconBackground: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      isPositive: true
    },
    {
      title: 'Total Ads',
      value: '0',
      subtitle: 'active listings',
      change: -2.1,
      changeText: '-2.1%',
      icon: 'campaign',
      iconColor: '#ffffff',
      iconBackground: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isPositive: false
    },
    {
      title: 'Page Views',
      value: '0',
      subtitle: 'this month',
      change: 15.7,
      changeText: '+15.7%',
      icon: 'visibility',
      iconColor: '#ffffff',
      iconBackground: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      isPositive: true
    }
  ];

  constructor() { }

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
}
