import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MainHeaderComponent} from './component/core/main-header-component/main-header-component';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainHeaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
