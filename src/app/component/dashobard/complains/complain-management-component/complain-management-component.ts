import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user-management-component',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './complain-management-component.html',
  standalone: true,
  styleUrl: './complain-management-component.scss'
})
export class ComplainManagementComponent {

}
