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
import {GeneralAdvertisementService} from '../../../../../../../../service/GeneralAdvertisement/general-advertisement';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';

import {FakeConformation} from '../fake-conformation/fake-conformation';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-view-verified-ad',
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
  templateUrl: './view-verified-ad.html',
  standalone: true,
  styleUrl: './view-verified-ad.scss'
})
export class ViewVerifiedAd implements OnInit{
  private readonly matDialog = inject(MatDialog);

  slotAd:any;
  imageUrls:any;

  constructor(
    private generalAdvertisementService:GeneralAdvertisementService,
    private snackbarService:SnackbarService,
    private cookieService:CookieService,
    public dialogRef: MatDialogRef<ViewVerifiedAd>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.slotAd = data;
    this.imageUrls = data.imageUrls;
  }

  ngOnInit(): void {
    console.log( 'verified add', this.slotAd );
  }


  fakeDialog(): void {
    const dialogVerifyRef = this.matDialog.open(FakeConformation, {
      width: '500px',
      disableClose: false
    });

    dialogVerifyRef.afterClosed().subscribe(result => {
      if (result) {
        this.fakeAdd();
      }
    });
  }

  fakeAdd(): void {

    const userId = this.cookieService.get("ceylonAddAdminID");
    this.generalAdvertisementService.markAsFake(this.slotAd.propertyId,userId).subscribe({
      next: (response) => {
        console.log('response', response );
        this.dialogRef.close(true);
        this.snackbarService.openSuccess( response.message ||  "Advertisement marked as fake successfully");

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while verifying the advertisement');
      }
    });
  }
}
