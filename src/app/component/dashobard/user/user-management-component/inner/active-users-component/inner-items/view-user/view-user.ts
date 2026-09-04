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
  selector: 'app-view-user',
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
  templateUrl: './view-user.html',
  standalone: true,
  styleUrl: './view-user.scss'
})
export class ViewUser implements OnInit{

  user:any;

  constructor(
    public dialogRef: MatDialogRef<ViewUser>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.user = data;
  }

  ngOnInit(): void {
    console.log( 'view user', this.user );
  }

  getRolesDisplay(): string {
    if (!this.user?.roles || !Array.isArray(this.user.roles) || this.user.roles.length === 0) {
      return 'Public User';
    }
    return this.user.roles.map((r: string) => {
      if (r === 'ADMIN') return 'Admin';
      if (r === 'ADS_AGENT') return 'Ads Agent';
      if (r === 'PUBLIC_USER' || r === 'USER') return 'Public User';
      return r;
    }).join(', ');
  }
}
