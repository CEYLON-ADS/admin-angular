import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reject-conformation',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle

  ],
  templateUrl: './reject-conformation.html',
  standalone: true,
  styleUrl: './reject-conformation.scss'
})
export class RejectConformation {

}
