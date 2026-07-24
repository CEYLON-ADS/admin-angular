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
import {GeneralAdvertisementService} from '../../../../../../../service/GeneralAdvertisement/general-advertisement';
import {SnackbarService} from '../../../../../../../service/snackbar/snackbar.service';
import {UnmarkAsFakeConformation} from '../unmark-as-fake-conformation/unmark-as-fake-conformation';

@Component({
  selector: 'app-view-fake-add',
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
  templateUrl: './view-fake-add.html',
  standalone: true,
  styleUrl: './view-fake-add.scss'
})
export class ViewFakeAdd implements OnInit{
  private readonly matDialog = inject(MatDialog);

  slotAd:any;
  imageUrls:any;

  constructor(
    private generalAdvertisementService:GeneralAdvertisementService,
    private snackbarService:SnackbarService,
    public dialogRef: MatDialogRef<ViewFakeAdd>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.slotAd = data;
    this.imageUrls = data.imageUrls;
  }

  ngOnInit(): void {
    console.log( 'verified add', this.slotAd );
  }


  fakeDialog(): void {
    const dialogVerifyRef = this.matDialog.open(UnmarkAsFakeConformation, {
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
    this.generalAdvertisementService.unmarkAsFake(this.slotAd.propertyId).subscribe({
      next: (response) => {
        console.log('response', response );
        this.dialogRef.close(true);
        this.snackbarService.openSuccess( response.message ||  "Advertisement Unmarked as fake successfully");

      },
      error: (error) => {
        console.error('error', error);
        this.snackbarService.openWarning(error.error?.message || 'An error occurred while verifying the advertisement');
      }
    });
  }
}
