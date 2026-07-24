import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, map, startWith, debounceTime, distinctUntilChanged, switchMap, BehaviorSubject } from 'rxjs';

import { CategoryService } from '../../../../../../../../service/category/category-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { UserService } from '../../../../../../../../service/user/user-service';
import { AdvertisementSlotService } from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';
import { SlotAdService } from '../../../../../../../../service/slot-ad/slot-ad-service';
import { SlotAdRequestDTO } from '../../../../../../../../dto/slot-ad-request-dto';

export interface Category {
  propertyId: string;
  categoryName: string;
  activeStatus: boolean;
}

export interface User {
  userId: string;
  mobileNumber: string;
  activeStatus: boolean;
}

export interface Slot {
  propertyId: string;
  slotNumber: number;
  activeState: boolean;
  availability: boolean;
  categoryId: string;
  categoryName: string;
}

@Component({
  selector: 'app-new-slot-advertisement',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    NgIf,
    MatOption,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    NgForOf,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe
  ],
  templateUrl: './new-slot-advertisement.html',
  standalone: true,
  styleUrls: ['./new-slot-advertisement.scss']
})
export class NewSlotAdvertisement implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  categories: Category[] = [];
  users: User[] = [];
  slots: Slot[] = [];
  filteredCategories: Observable<Category[]>;
  filteredUsers: Observable<User[]>;
  filteredSlots: Observable<Slot[]>;
  previewImages: string[] = [];
  selectedFiles: File[] = [];
  selectedUser: any;
  selectedSlot: any;
  private selectedCategoryId = new BehaviorSubject<string>('');

  constructor(
      private formBuilder: FormBuilder,
      private advertisementSlotService: AdvertisementSlotService,
      private categoryService: CategoryService,
      private snackbarService: SnackbarService,
      private userService: UserService,
      private slotAdService: SlotAdService,
      private dialogRef: MatDialogRef<NewSlotAdvertisement>,
      private cdr: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slotForm = this.createForm();
    this.filteredCategories = this.slotForm.get('categoryName')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const searchCategory = typeof value === 'string' ? value : value?.categoryName || '';
          return this.categoryService.searchCategories(searchCategory, 0, 5).pipe(
              map(response => {
                if (response && response.body && response.body.data && response.body.data.dataList) {
                  return response.body.data.dataList;
                } else if (response && response.data && response.data.dataList) {
                  return response.data.dataList;
                }
                return response.dataList || [];
              })
          );
        })
    );
    this.filteredUsers = this.slotForm.get('userName')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const searchUsers = typeof value === 'string' ? value : value?.mobileNumber || '';
          return this.userService.searchActiveUsers(searchUsers, 0, 5).pipe(
              map(response => {
                if (response && response.body && response.body.data && response.body.data.dataList) {
                  return response.body.data.dataList;
                } else if (response && response.data && response.data.dataList) {
                  return response.data.dataList;
                }
                return response.dataList || [];
              })
          );
        })
    );
    this.filteredSlots = this.selectedCategoryId.pipe(
        switchMap(categoryId => {
          if (!categoryId) return [[]];
          return this.slotForm.get('slotNumber')!.valueChanges.pipe(
              startWith(''),
              debounceTime(300),
              distinctUntilChanged(),
              switchMap(value => {
                const searchSlots = typeof value === 'string' ? value : value?.slotNumber?.toString() || '';
                return this.advertisementSlotService.getByCategory(categoryId).pipe(
                    map(response => {
                      const slots: Slot[] = response.data || [];
                      return slots.filter((slot: Slot) =>
                          slot.slotNumber.toString().toLowerCase().includes(searchSlots.toLowerCase())
                      );
                    })
                );
              })
          );
        })
    );
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllUsers();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      slotNumber: ['', [Validators.required]],
      redirectUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/.*)?$/)]],
      advertisement: [null, [Validators.required]],
      categoryName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
    });
  }

  onCategorySelected(category: Category): void {
    this.slotForm.patchValue({
      categoryName: category.categoryName,
      categoryId: category.propertyId,
      slotNumber: null,
      slotId: null
    });
    this.selectedCategoryId.next(category.propertyId);
    this.getSlotsByCategory(category.propertyId);
  }

  onUserSelected(user: User): void {
    this.selectedUser = user;
    this.slotForm.patchValue({
      userName: user,
      userId: user.userId
    });
  }

  onSlotSelected(slot: Slot): void {
    this.selectedSlot = slot;
    this.slotForm.patchValue({
      slotNumber: slot,
      slotId: slot.propertyId,
      categoryName: slot.categoryName,
      categoryId: slot.categoryId
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.slotForm.get('advertisement')?.setValue(this.selectedFiles);
      this.slotForm.get('advertisement')?.markAsTouched();

      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImages = [...this.previewImages, reader.result as string];
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.previewImages = this.previewImages.filter((_, i) => i !== index);
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.slotForm.get('advertisement')?.setValue(this.selectedFiles.length > 0 ? this.selectedFiles : null);
    this.cdr.detectChanges();
  }

  displayCategoryFn(category: Category | string): string {
    if (typeof category === 'string') {
      return category;
    }
    return category && category.categoryName ? category.categoryName : '';
  }

  displayUserFn(user: User | string): string {
    if (typeof user === 'string') {
      return user;
    }
    return user && user.mobileNumber ? user.mobileNumber : '';
  }

  displaySlotFn(slot: Slot | string): string {
    if (typeof slot === 'string') {
      return slot;
    }
    return slot && slot.slotNumber !== undefined ? slot.slotNumber.toString() : '';
  }

  getAllCategories() {
    this.categoryService.searchCategories('', 0, 5).subscribe({
      next: (response) => {
        if (response && response.body && response.body.data && response.body.data.dataList) {
          this.categories = response.body.data.dataList;
        } else if (response && response.data && response.data.dataList) {
          this.categories = response.data.dataList;
        } else {
          this.categories = response.dataList || [];
        }
        this.cdr.detectChanges();
        if (this.categories.length > 0) {
          this.onCategorySelected(this.categories[0]);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.cdr.detectChanges();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load categories');
      }
    });
  }

  getAllUsers() {
    this.userService.searchActiveUsers('', 0, 5).subscribe({
      next: (response) => {
        if (response && response.body && response.body.data && response.body.data.dataList) {
          this.users = response.body.data.dataList;
        } else if (response && response.data && response.data.dataList) {
          this.users = response.data.dataList;
        } else {
          this.users = response.dataList || [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
        this.cdr.detectChanges();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load users');
      }
    });
  }

  getSlotsByCategory(categoryId: string) {
    this.advertisementSlotService.getByCategory(categoryId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.slots = response.data;
        } else {
          this.slots = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.slots = [];
        this.cdr.detectChanges();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load slots');
      }
    });
  }

  onSave(): void {

    if (this.slotForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('redirectLink', this.slotForm.value.redirectUrl);
      formData.append('slotId', this.selectedSlot?.propertyId);
      formData.append('userId', this.selectedUser?.propertyId);

      // Append each image file to images array
      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
      });

      this.slotAdService.createSlotAd(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.snackbarService.openSuccess(res.message);
          this.cdr.detectChanges();
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Error creating slot request:', error);
          this.snackbarService.openWarning(error.error?.message || 'Failed to create slot advertisement');
        }
      });
    } else {
      Object.keys(this.slotForm.controls).forEach(key => {
        this.slotForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
