import {Component, inject, Inject, Input, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose, MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {VerifiConformation} from '../../pending-ads-components/inner-items/verifi-conformation/verifi-conformation';

import {GeneralAdvertisementService} from '../../../../../../../service/GeneralAdvertisement/general-advertisement';
import {SnackbarService} from '../../../../../../../service/snackbar/snackbar.service';

@Component({
  selector: 'app-view-rejected-add',
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
  templateUrl: './view-rejected-add.html',
  standalone: true,
  styleUrl: './view-rejected-add.scss'
})
export class ViewRejectedAdd implements OnInit{
  private readonly matDialog = inject(MatDialog);

  slotAd:any;
  imageUrls:any;

  constructor(
    private generalAdvertisementService:GeneralAdvertisementService,
    private snackbarService:SnackbarService,
    public dialogRef: MatDialogRef<ViewRejectedAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.slotAd = data;
    this.imageUrls = data.imageUrls;
  }

  ngOnInit(): void {
    console.log( 'pending add', this.slotAd );
  }


  verifyDialog(): void {
    const dialogVerifyRef = this.matDialog.open(VerifiConformation, {
      width: '500px',
      disableClose: false
    });

    dialogVerifyRef.afterClosed().subscribe(result => {
      if (result) {
        this.verify();
      }
    });
  }

  verify(): void {
    this.generalAdvertisementService.verifyAdvertisement(this.slotAd.propertyId,'a4adc96a-7425-4498-b656-1b942bea25a2').subscribe({
      next: (response) => {
        console.log('response', response );
        this.dialogRef.close(true);
        this.snackbarService.openSuccess( response.message ||  "Advertisement verified successfully");

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while verifying the advertisement');
      }
    });
  }




}
