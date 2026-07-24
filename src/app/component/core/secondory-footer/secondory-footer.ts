import {Component} from '@angular/core';

@Component({
  selector: 'app-secondory-footer',
  imports: [],
  templateUrl: './secondory-footer.html',
  styleUrl: './secondory-footer.scss'
})
export class SecondoryFooter {
  year =new Date().getFullYear();
}
