import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {AdvertisementSlotService} from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';


@Component({
  selector: 'app-advertisement-slot-state',
  imports: [MatSlideToggleModule],
  templateUrl: './advertisement-slot-state.html',
  standalone: true,
  styleUrl: './advertisement-slot-state.scss'
})
export class AdvertisementSlotState implements OnInit {
  @Input() slot: any;
  @Output() statusChanged = new EventEmitter<void>(); // Emit new status to parent

  loading = false;

  constructor(
    private advertisementSlotService: AdvertisementSlotService,
    private snackbarService:SnackbarService

  ) {}

  ngOnInit(): void {
    console.log('category', this.slot);
  }

  toggleStatus() {
    this.loading = true;

    this.advertisementSlotService.changeActiveStatus(this.slot.propertyId).subscribe({
      next: (response) => {
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
