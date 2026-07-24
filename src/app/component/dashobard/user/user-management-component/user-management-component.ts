import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user-management-component',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './user-management-component.html',
  standalone: true,
  styleUrl: './user-management-component.scss'
})
export class UserManagementComponent {

}
