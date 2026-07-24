import { Component } from '@angular/core';
import {MainHeaderComponent} from '../main-header-component/main-header-component';
import {RouterOutlet} from '@angular/router';
import {MainSidebar} from '../main-sidebar/main-sidebar';
import {SecondoryFooter} from '../secondory-footer/secondory-footer';


@Component({
  selector: 'app-main-context',
  imports: [
    RouterOutlet,
    MainSidebar,
    SecondoryFooter
  ],
  templateUrl: './main-context.html',
  styleUrl: './main-context.scss'
})
export class MainContext {

}
