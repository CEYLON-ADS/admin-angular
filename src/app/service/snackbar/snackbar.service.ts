import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar:MatSnackBar) { }

  openWarning(message:any='Something went wrong please try again later', action:string='Close'){
    this.snackbar.open(message,action,{
      horizontalPosition:"center",
      verticalPosition:"bottom",
      duration:5000,
      panelClass:['warning-panel']
    })
  }
  openSuccess(message:any='Success!', action:string='Close'){
    this.snackbar.open(message,action,{
      horizontalPosition:"center",
      verticalPosition:"bottom",
      duration:5000,
      panelClass:['success-panel']
    })
  }
}
