import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-verifi-conformation',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle

  ],
  templateUrl: './verifi-conformation.html',
  standalone: true,
  styleUrl: './verifi-conformation.scss'
})
export class VerifiConformation {

}
