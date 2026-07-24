import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';


@Component({
  selector: 'app-unmark-as-fake-conformation',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle

  ],
  templateUrl: './unmark-as-fake-conformation.html',
  standalone: true,
  styleUrl: './unmark-as-fake-conformation.scss'
})
export class UnmarkAsFakeConformation {

}
