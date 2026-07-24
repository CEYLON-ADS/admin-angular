import { Component } from '@angular/core';

import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-advertisement-component',
  imports: [
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './advertisement-component.html',
  standalone: true,
  styleUrl: './advertisement-component.scss'
})
export class AdvertisementComponent {

}
