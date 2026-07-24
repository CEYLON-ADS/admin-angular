import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-fake-conformation',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle

  ],
  templateUrl: './fake-conformation.html',
  standalone: true,
  styleUrl: './fake-conformation.scss'
})
export class FakeConformation {

}
