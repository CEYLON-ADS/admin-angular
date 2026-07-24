import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {SnackbarService} from '../../../../../../../../service/snackbar/snackbar.service';
import {SlotAdService} from '../../../../../../../../service/slot-ad/slot-ad-service';


@Component({
  selector: 'app-slot-advertisement-status',
  imports: [MatSlideToggleModule],
  templateUrl: './slot-advertisement-status.html',
  standalone: true,
  styleUrl: './slot-advertisement-status.scss'
})
export class SlotAdvertisementStatus implements OnInit {
  @Input() slot: any;
  @Output() statusChanged = new EventEmitter<void>(); // Emit new status to parent

  loading = false;

  constructor(
    private snackbarService:SnackbarService,
    private slotAdService:SlotAdService

  ) {}

  ngOnInit(): void {
    // console.log('toggle slot', this.slot);
  }

  toggleStatus() {
    this.loading = true;

    this.slotAdService.changeActiveStatus(this.slot.propertyId).subscribe({
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
