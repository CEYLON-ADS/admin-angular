import {Component, inject} from '@angular/core';

import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';



@Component({
  selector: 'app-category-management-component',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

  ],
  templateUrl: './category-management-component.html',
  standalone: true,
  styleUrl: './category-management-component.scss'
})
export class CategoryManagementComponent {


}
