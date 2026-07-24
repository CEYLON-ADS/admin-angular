import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-date-component',
  imports: [
    MatCard,
    MatCardContent,
    DatePipe
  ],
  templateUrl: './date-component.html',
  standalone: true,
  styleUrl: './date-component.scss'
})
export class DateComponent {
  currentDate = new Date();
}
