import {Component, Inject, Input, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose, MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-view-slot-add',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    FormsModule,
    MatDialogContent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './view-slot-add.html',
  standalone: true,
  styleUrl: './view-slot-add.scss'
})
export class ViewSlotAdd implements OnInit{

  slotAd:any;
  imageUrls:any;

  constructor(
    public dialogRef: MatDialogRef<ViewSlotAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.slotAd = data;
    this.imageUrls = data.imageUrls;
  }

  ngOnInit(): void {
    console.log( 'slot add', this.slotAd );
  }
}
