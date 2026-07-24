import {Component, Input} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-spinner.html',
  standalone: true,
  styleUrl: './progress-spinner.scss'
})
export class ProgressSpinner {
  @Input() diameter = "25"
  @Input() strokeWidth = "3"

}
