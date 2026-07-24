import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {AdvertisementSlotService} from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';

@Component({
  selector: 'app-advertisement-slot-availability-state',
  imports: [MatSlideToggleModule],
  templateUrl: './advertisement-slot-availability-state.html',
  standalone: true,
  styleUrl: './advertisement-slot-availability-state.scss'
})
export class AdvertisementSlotAvailabilityState implements OnInit {
  @Input() slot: any;
  @Output() statusChanged = new EventEmitter<void>(); // Emit new status to parent

  loading = false; // Optional: show loading while API call

  constructor(
    private snackbarService:SnackbarService,
    private advertisementSlotService:AdvertisementSlotService

  ) {}

  ngOnInit(): void {
    console.log('slot', this.slot);
  }

  toggleStatus() {
    const newStatus = !this.slot.availability;
    this.loading = true;

    this.advertisementSlotService.changeAvailabilityStatus(this.slot.propertyId, newStatus).subscribe({
      next: (response) => {
        this.slot.availability = newStatus;
        this.snackbarService.openSuccess(response.message);
        this.statusChanged.emit();
        this.loading = false;
      },
      error: (error) => {
        console.error('error', error);
        this.loading = false;
        this.snackbarService.openWarning(error.error.message);
      }
    });
  }



}
