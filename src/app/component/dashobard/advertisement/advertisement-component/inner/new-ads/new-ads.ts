import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import {NewAdvertisement} from './inner-items/new-advertisement/new-advertisement';

@Component({
  selector: 'app-new-ads',
  imports: [

  ],
  templateUrl: './new-ads.html',
  standalone: true,
  styleUrl: './new-ads.scss'
})
export class NewAds {
  private readonly matDialog = inject(MatDialog);

  constructor(
  ) {}

  openDialog(): void {
    const dialogRef = this.matDialog.open(NewAdvertisement, {
      width: '600px',
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
