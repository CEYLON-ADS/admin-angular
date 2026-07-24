import { Component, Inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
  selector: 'app-update-slot-advertisement',
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
  templateUrl: './update-slot-advertisement.html',
  standalone: true,
  styleUrl: './update-slot-advertisement.scss'
})
export class UpdateSlotAdvertisement implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  categories: Category[] = [];
  users: User[] = [];
  slots: Slot[] = [];
  filteredCategories!: Observable<Category[]>;
  filteredUsers!: Observable<User[]>;
  filteredSlots!: Observable<Slot[]>;
  previewImages: string[] = [];
  selectedFiles: File[] = [];
  selectedUser: any;
  selectedSlot: any;

  slotAddData: any;

  private selectedCategoryId = new BehaviorSubject<string>('');

  constructor(
    private formBuilder: FormBuilder,
    private advertisementSlotService: AdvertisementSlotService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private slotAdService: SlotAdService,
    private dialogRef: MatDialogRef<UpdateSlotAdvertisement>,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.slotAddData = data;
    console.log('slot add data ', this.slotAddData);

    this.slotForm = this.createForm();
    this.initializeFormData();
  }

  ngOnInit(): void {
    this.patchFormWithData();
    this.getAllCategories();
    this.getAllUsers();
    if (this.slotAddData?.categoryId) {
      this.getSlotsByCategory(this.slotAddData.categoryId);
    }

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

  // Rest of the component remains the same as in the previous response
  private createForm(): FormGroup {
    return this.formBuilder.group({
      slotNumber: ['', [Validators.required]],
      redirectUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/.*)?$/)]],
      advertisement: [null, [Validators.required]],
      categoryName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      categoryId: [''],
      slotId: [''],
      userId: ['']
    });
  }

  private initializeFormData(): void {
    if (this.slotAddData) {
      this.slotForm.patchValue({
        redirectUrl: this.slotAddData.redirectLink,
        categoryName: this.slotAddData.categoryName,
        categoryId: this.slotAddData.categoryId,
        slotNumber: this.slotAddData.slotNumber,
        slotId: this.slotAddData.slotId,
        userName: this.slotAddData.userMobileNumber,
        userId: this.slotAddData.userId
      });

      if (this.slotAddData.imageUrls && this.slotAddData.imageUrls.length > 0) {
        this.previewImages = this.slotAddData.imageUrls.map((img: any) => img.url);
        this.slotForm.get('advertisement')?.setValue(this.previewImages);
      }
    }
  }

  private patchFormWithData(): void {
    if (this.slotAddData) {
      const category: Category = {
        propertyId: this.slotAddData.categoryId,
        categoryName: this.slotAddData.categoryName,
        activeStatus: true
      };
      this.onCategorySelected(category);
      this.selectedCategoryId.next(this.slotAddData.categoryId);

      const slot: Slot = {
        propertyId: this.slotAddData.slotId,
        slotNumber: this.slotAddData.slotNumber,
        activeState: this.slotAddData.activeStatus,
        availability: true,
        categoryId: this.slotAddData.categoryId,
        categoryName: this.slotAddData.categoryName
      };
      this.onSlotSelected(slot);

      const user: User = {
        userId: this.slotAddData.userId,
        mobileNumber: this.slotAddData.userMobileNumber,
        activeStatus: true
      };
      this.onUserSelected(user);

      this.zone.run(() => {
        setTimeout(() => {
          this.cdr.detectChanges();
        });
      });
    }
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
          this.zone.run(() => {
            this.cdr.detectChanges();
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.previewImages = this.previewImages.filter((_, i) => i !== index);
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.slotForm.get('advertisement')?.setValue(this.selectedFiles.length > 0 ? this.selectedFiles : null);
    this.zone.run(() => {
      this.cdr.detectChanges();
    });
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
        this.zone.run(() => {
          setTimeout(() => {
            this.cdr.detectChanges();
            if (this.slotAddData?.categoryId) {
              const selectedCategory = this.categories.find(c => c.propertyId === this.slotAddData.categoryId);
              if (selectedCategory) {
                this.onCategorySelected(selectedCategory);
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
        this.zone.run(() => {
          this.cdr.detectChanges();
          this.snackbarService.openWarning(error.error?.message || 'Failed to load categories');
        });
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
        this.zone.run(() => {
          setTimeout(() => {
            this.cdr.detectChanges();
            if (this.slotAddData?.userId) {
              const selectedUser = this.users.find(u => u.userId === this.slotAddData.userId);
              if (selectedUser) {
                this.onUserSelected(selectedUser);
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
        this.zone.run(() => {
          this.cdr.detectChanges();
          this.snackbarService.openWarning(error.error?.message || 'Failed to load users');
        });
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
        this.zone.run(() => {
          setTimeout(() => {
            this.cdr.detectChanges();
            if (this.slotAddData?.slotId) {
              const selectedSlot = this.slots.find(s => s.propertyId === this.slotAddData.slotId);
              if (selectedSlot) {
                this.onSlotSelected(selectedSlot);
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.slots = [];
        this.zone.run(() => {
          this.cdr.detectChanges();
          this.snackbarService.openWarning(error.error?.message || 'Failed to load slots');
        });
      }
    });
  }

  onSave(): void {
    if (this.slotForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('redirectLink', this.slotForm.value.redirectUrl);
      formData.append('slotId', this.selectedSlot?.propertyId);
      formData.append('userId', this.selectedUser?.userId);

      this.selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
      });

      this.slotAdService.updateSlotAd(this.slotAddData.propertyId, formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.snackbarService.openSuccess(res.message);
          this.zone.run(() => {
            this.cdr.detectChanges();
            this.dialogRef.close(true);
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.zone.run(() => {
            this.cdr.detectChanges();
            console.error('Error creating slot request:', error);
            this.snackbarService.openWarning(error.error?.message || 'Failed to create slot advertisement');
          });
        }
      });
    } else {
      Object.keys(this.slotForm.controls).forEach(key => {
        this.slotForm.get(key)?.markAsTouched();
      });
      this.zone.run(() => {
        this.cdr.detectChanges();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
