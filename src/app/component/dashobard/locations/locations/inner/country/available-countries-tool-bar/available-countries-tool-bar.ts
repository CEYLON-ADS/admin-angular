import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NewCountry} from '../new-country/new-country';

@Component({
  selector: 'app-available-countries-tool-bar',
  imports: [

  ],
  templateUrl: './available-countries-tool-bar.html',
  styleUrl: './available-countries-tool-bar.scss'
})
export class AvailableCountriesToolBar {
  @Output() dataloader:EventEmitter<any>=new EventEmitter<any>();
  constructor(private dialog: MatDialog) {
  }

  openNewCountry() {
    const result = this.dialog.open(NewCountry,{
      width:'500px',
      disableClose:true
    });

    result.afterClosed().subscribe(response=>{
      if (response){
        this.dataloader.emit(true)
      }
    })
  }

  refresh() {
    this.dataloader.emit(true)
  }
}
