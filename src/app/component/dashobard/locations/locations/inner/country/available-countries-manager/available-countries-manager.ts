import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../../../../../../service/snackbar/snackbar.service';
import {CountriesService} from '../../../../../../../service/locations/countries-service';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-available-countries-manager',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    NgIf,
    RouterLink,
    MatMenuTrigger
  ],
  templateUrl: './available-countries-manager.html',
  styleUrl: './available-countries-manager.scss'
})
export class AvailableCountriesManager {
  @Input() data: any
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean = false;

  constructor(private countryService: CountriesService,
              private dialogService: MatDialog,
              private snackbarService: SnackbarService) {
  }

  deleteCountry() {
    this.loading = true;
    this.countryService.deleteCountry(this.data?.propertyId)
      .subscribe(response => {
        this.loading = false;
        this.snackbarService.openSuccess("The Country has been Deleted!", "Close");
        this.emitter.emit(true);
      }, error => {
        this.snackbarService.openWarning(error);
        this.loading = false;
      })
  }


  readMore() {
    /*  this.dialogService.open(AvailableCountriesSeeMoreComponent, {
        width: '500px',
        disableClose:true,
        data: {country: this.data}
      });*/
  }

  updateBasicInfo() {
    /* this.dialogService.open(AvailableCountryUpdateBasicInfoComponent, {
       width: '500px',
       disableClose:true,
       data: {country: this.data}
     });*/
  }

  manageLang() {
    /*this.dialogService.open(AvailableCountriesAvLangManagerComponent, {
      width: '500px',
      disableClose:true,
      data: {country: this.data}
    });*/
  }
}
