import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-delete-conformation',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle

  ],
  templateUrl: './delete-conformation.html',
  standalone: true,
  styleUrl: './delete-conformation.scss'
})
export class DeleteConformation {


}
