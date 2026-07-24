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
import {DeleteConformation} from '../../../../../../../core/delete-conformation/delete-conformation';

import {VerifiConformation} from '../verifi-conformation/verifi-conformation';
import {RejectConformation} from '../reject-conformation/reject-conformation';
import {GeneralAdvertisementService} from '../../../../../../../../service/GeneralAdvertisement/general-advertisement';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-view-pending-add',
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
  templateUrl: './view-pending-add.html',
  standalone: true,
  styleUrl: './view-pending-add.scss'
})
export class ViewPendingAdd implements OnInit{
  private readonly matDialog = inject(MatDialog);

  slotAd:any;
  imageUrls:any;

  constructor(
    private generalAdvertisementService:GeneralAdvertisementService,
    private snackbarService:SnackbarService,
    private cookieService:CookieService,
    public dialogRef: MatDialogRef<ViewPendingAdd>,
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
    const userId = this.cookieService.get("ceylonAddAdminID");
    this.generalAdvertisementService.verifyAdvertisement(this.slotAd.propertyId,userId).subscribe({
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

  rejectDialog(): void {
    const dialogDeleteRef = this.matDialog.open(RejectConformation, {
      width: '500px',
      disableClose: false
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if (result) {
       this.reject();
      }
    });
  }

  reject(): void {
    this.generalAdvertisementService.rejectAdvertisement(this.slotAd.propertyId).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
        this.snackbarService.openSuccess( response.message ||  "Advertisement rejected successfully");

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while rejecting the advertisement');
      }
    });
  }

}
