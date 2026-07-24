import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-black-list-conformation',
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose
  ],
  templateUrl: './black-list-conformation.html',
  standalone: true,
  styleUrl: './black-list-conformation.scss'
})
export class BlackListConformation {

}
