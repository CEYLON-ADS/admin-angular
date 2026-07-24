import { Component, OnInit } from '@angular/core';
import {CountriesService} from '../../../../../../../service/locations/countries-service';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {SnackbarService} from '../../../../../../../service/snackbar/snackbar.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CountryDto} from '../../../../../../../dto/CountryDto';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-new-country',
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogActions,
    NgIf,
    MatButton
  ],
  templateUrl: './new-country.html',
  styleUrl: './new-country.scss'
})
export class NewCountry  implements OnInit {
  constructor(private countryService: CountriesService,
              private snackbarService: SnackbarService,
              public dialogRef: MatDialogRef<NewCountry>) {
  }

  loading = false;

  form = new FormGroup({
    capital: new FormControl('',
      [Validators.required]),
    continentCode: new FormControl('',
      [Validators.required]),
    continentName: new FormControl('',
      [Validators.required]),
    countryCode: new FormControl('',
      [Validators.required]),
    dialCode: new FormControl('',
      [Validators.required]),
    countryName: new FormControl('',
      [Validators.required]),
    currencyCode: new FormControl('',
      [Validators.required]),
    currencyName: new FormControl('',
      [Validators.required]),
    currencySymbol: new FormControl('',
      [Validators.required])
  });

  createProgram() {
    this.loading = true;
    const currentDate = new Date();

    const data: CountryDto = {
      capital:this.form.value.capital?.trim(),
      continentCode:this.form.value.continentCode?.trim(),
      continentName:this.form.value.continentName?.trim(),
      countryCode:this.form.value.countryCode?.trim(),
      dialCode:this.form.value.dialCode?.trim(),
      countryName:this.form.value.countryName?.trim(),
      currencyCode:this.form.value.currencyCode?.trim(),
      currencyName:this.form.value.currencyName?.trim(),
      currencySymbol:this.form.value.currencySymbol?.trim()
    }


    this.countryService.createCountry(data,currentDate)
      .subscribe(response => {
        this.loading = false;
        this.snackbarService.openSuccess("The Country has been Added!", "Close");
        this.dialogRef.close(true);
      }, error => {
        this.snackbarService.openWarning(error?.error?.message);
        this.loading = false;
      })
  }

  public closeDialog() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {

  }
}
