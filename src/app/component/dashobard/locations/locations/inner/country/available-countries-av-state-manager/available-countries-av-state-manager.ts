import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SnackbarService} from '../../../../../../../service/snackbar/snackbar.service';
import {CountriesService} from '../../../../../../../service/locations/countries-service';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-available-countries-av-state-manager',
  imports: [
    MatSlideToggle
  ],
  templateUrl: './available-countries-av-state-manager.html',
  styleUrl: './available-countries-av-state-manager.scss'
})
export class AvailableCountriesAvStateManager {
  loading = false;
  @Input() data: any;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private snackbarService: SnackbarService, private countryService: CountriesService) {
  }

  setState() {
    this.loading = true;
    this.countryService.updateCountryStatus(this.data?.propertyId, !this.data?.activeState).subscribe(response => {
      this.loading = false;
      this.snackbarService.openSuccess(response?.message,'Close');
      this.data.activeState=!this.data?.activeState;
    }, error => {
      this.loading = false;
      this.snackbarService.openWarning();
      this.emitter.emit(false);
    })
  }
}
