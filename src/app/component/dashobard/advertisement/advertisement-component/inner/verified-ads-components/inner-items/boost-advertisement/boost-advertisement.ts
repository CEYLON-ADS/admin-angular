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
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipGrid, MatChipRow, MatChipInputEvent, MatChipInput } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
// import { Observable, map, startWith, debounceTime, distinctUntilChanged, switchMap, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { QuillModule } from 'ngx-quill';

import { CategoryService } from '../../../../../../../../service/category/category-service';
import { SnackbarService } from '../../../../../../../../service/snackbar/snackbar.service';
import { UserService } from '../../../../../../../../service/user/user-service';
// import { AdvertisementSlotService } from '../../../../../../../../service/advertisement-slot/advertisement-slot-service';
// import { SlotAdService } from '../../../../../../../../service/slot-ad/slot-ad-service';
import { AdvertiseTypeService } from '../../../../../../../../service/AdvertiseType/advertise-type-service';
// import { CitiesService } from '../../../../../../../../service/locations/cities-service';
import { GeneralAdvertisementService } from '../../../../../../../../service/GeneralAdvertisement/general-advertisement';
import {GeneralAdvertisementProcessService} from '../../../../../../../../service/GeneralAdvertisementProcess/general-advertisement-process-service';

export interface Category {
  propertyId: string;
  categoryName: string;
  activeStatus: boolean;
}

export interface User {
  propertyId: string;
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

export interface AdType {
  propertyId: string;
  type: string;
  price: number;
}

export interface City {
  propertyID: string;
  city: string;
  district: string;
}

@Component({
  selector: 'app-boost-advertisement',
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
    MatSelect,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    NgForOf,
    QuillModule
  ],
  templateUrl: './boost-advertisement.html',
  standalone: true,
  styleUrl: './boost-advertisement.scss'
})
export class BoostAdvertisement implements OnInit {
  slotForm: FormGroup;
  isLoading = false;
  categories: Category[] = [];
  users: User[] = [];
  slots: Slot[] = [];
  types: AdType[] = [];
  cities: City[] = [];
  selectedCities: City[] = [];
  // filteredCategories: Observable<Category[]>;
  // filteredUsers: Observable<User[]>;
  // filteredCities: Observable<City[]>;
  previewImages: string[] = [];
  previewPaymentSlips: string[] = [];
  selectedFiles: File[] = [];
  selectedPaymentSlips: File[] = [];
  selectedUser: User | null = null;
  selectedCategory: Category | null = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  advertisement: any;

  // private selectedCategoryId = new BehaviorSubject<string>('');

  constructor(
    private formBuilder: FormBuilder,
    // private advertisementSlotService: AdvertisementSlotService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    // private slotAdService: SlotAdService,
    private advertiseTypeService: AdvertiseTypeService,
    // private citiesService: CitiesService,
    private generalAdvertisementService: GeneralAdvertisementService,
    private generalAdvertisementProcessService:GeneralAdvertisementProcessService,
    private dialogRef: MatDialogRef<BoostAdvertisement>,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.advertisement = data;
    console.log("comming add", this.advertisement);

    this.slotForm = this.createForm();
    // this.filteredCategories = this.slotForm.get('categoryName')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap(value => {
    //     const searchCategory = typeof value === 'string' ? value : value?.categoryName || '';
    //     return this.categoryService.searchCategories(searchCategory, 0, 5).pipe(
    //       map(response => response.body?.data?.dataList || response.data?.dataList || response.dataList || [])
    //     );
    //   })
    // );
    // this.filteredUsers = this.slotForm.get('userName')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap(value => {
    //     const searchUsers = typeof value === 'string' ? value : value?.mobileNumber || '';
    //     return this.userService.searchActiveUsers(searchUsers, 0, 5).pipe(
    //       map(response => response.body?.data?.dataList || response.data?.dataList || response.dataList || [])
    //     );
    //   })
    // );
    // this.filteredCities = this.slotForm.get('currentCity')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap(value => {
    //     const searchCity = typeof value === 'string' ? value : value?.city || '';
    //     return this.citiesService.searchCities(searchCity, 0, 5).pipe(
    //       map(response => response.body?.data?.dataList || response.data?.dataList || response.dataList || [])
    //     );
    //   })
    // );

    this.slotForm.statusChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    // this.getAllCategories();
    // this.getAllUsers();
    this.getAllTypes();
    // this.getAllCities();
    this.patchAdvertisementData();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      // advertisement: [null],
      paymentSlips: [null],
      // categoryName: ['', Validators.required],
      // userName: ['', Validators.required],
      // adTitle: ['', Validators.required],
      serviceFee: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d*\.?\d*$/)]],
      type: ['', Validators.required],
      description: ['', Validators.required],
      // whatsapp: [false],
      // telegram: [false],
      // viber: [false],
      // imo: [false],
      // cities: [[], Validators.required],
      // currentCity: ['']
    });
  }

  private patchAdvertisementData(): void {
    if (this.advertisement) {
      this.slotForm.patchValue({
        // adTitle: this.advertisement.title,
        // whatsapp: this.advertisement.whatsapp,
        // telegram: this.advertisement.telegram,
        // viber: this.advertisement.viber,
        // imo: this.advertisement.imo,
        categoryName: this.advertisement.categoryName,
        // userName: this.advertisement.userMobileNumber
      });

      // this.selectedCategory = {
      //   propertyId: this.advertisement.categoryId,
      //   categoryName: this.advertisement.categoryName,
      //   activeStatus: true
      // };

      // this.selectedUser = {
      //   propertyId: this.advertisement.userId,
      //   mobileNumber: this.advertisement.userMobileNumber,
      //   activeStatus: true
      // };

      // this.selectedCities = this.advertisement.cities.map((city: string) => ({
      //   propertyID: city,
      //   city: city,
      //   district: ''
      // }));

      // this.slotForm.get('cities')?.setValue(this.selectedCities);
      // this.previewImages = this.advertisement.imageUrls.map((img: any) => img.url);
    }
  }

  // onCategorySelected(category: Category): void {
  //   this.selectedCategory = category;
  //   this.slotForm.patchValue({
  //     categoryName: category.categoryName
  //   });
  //   this.cdr.markForCheck();
  // }

  // onUserSelected(user: User): void {
  //   this.selectedUser = user;
  //   this.slotForm.patchValue({
  //     userName: user.mobileNumber
  //   });
  //   this.cdr.markForCheck();
  // }

  // addCity(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();
  //   if (value) {
  //     const city = this.cities.find(c => c.city.toLowerCase() === value.toLowerCase());
  //     if (city && !this.selectedCities.some(c => c.propertyID === city.propertyID)) {
  //       this.selectedCities = [...this.selectedCities, city];
  //       this.slotForm.get('cities')?.setValue(this.selectedCities);
  //       this.slotForm.get('cities')?.markAsTouched();
  //     }
  //   }
  //   event.chipInput!.clear();
  //   this.slotForm.get('currentCity')?.setValue('');
  //   this.cdr.markForCheck();
  // }

  // removeCity(city: City): void {
  //   this.selectedCities = this.selectedCities.filter(c => c.propertyID !== city.propertyID);
  //   this.slotForm.get('cities')?.setValue(this.selectedCities.length > 0 ? this.selectedCities : []);
  //   this.cdr.markForCheck();
  // }

  // selectCity(event: any): void {
  //   const city = event.option.value;
  //   if (!this.selectedCities.some(c => c.propertyID === city.propertyID)) {
  //     this.selectedCities = [...this.selectedCities, city];
  //     this.slotForm.get('cities')?.setValue(this.selectedCities);
  //     this.slotForm.get('cities')?.markAsTouched();
  //   }
  //   this.slotForm.get('currentCity')?.setValue('');
  //   this.cdr.markForCheck();
  // }

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const newFiles = Array.from(input.files);
  //     this.selectedFiles = [...this.selectedFiles, ...newFiles];
  //     this.slotForm.get('advertisement')?.setValue(this.selectedFiles);
  //     this.slotForm.get('advertisement')?.markAsTouched();
  //     newFiles.forEach(file => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         this.previewImages = [...this.previewImages, reader.result as string];
  //         this.cdr.markForCheck();
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   }
  // }

  onPaymentSlipSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedPaymentSlips = [...this.selectedPaymentSlips, ...newFiles];
      this.slotForm.get('paymentSlips')?.setValue(this.selectedPaymentSlips);
      this.slotForm.get('paymentSlips')?.markAsTouched();
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewPaymentSlips = [...this.previewPaymentSlips, reader.result as string];
          this.cdr.markForCheck();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // removeImage(index: number): void {
  //   this.previewImages = this.previewImages.filter((_, i) => i !== index);
  //   this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  //   this.slotForm.get('advertisement')?.setValue(this.selectedFiles.length > 0 ? this.selectedFiles : null);
  //   this.cdr.markForCheck();
  // }

  removePaymentSlip(index: number): void {
    this.previewPaymentSlips = this.previewPaymentSlips.filter((_, i) => i !== index);
    this.selectedPaymentSlips = this.selectedPaymentSlips.filter((_, i) => i !== index);
    this.slotForm.get('paymentSlips')?.setValue(this.selectedPaymentSlips.length > 0 ? this.selectedPaymentSlips : null);
    this.cdr.markForCheck();
  }

  // displayCategoryFn(category: Category | string): string {
  //   return typeof category === 'string' ? category : category?.categoryName || '';
  // }
  //
  // displayUserFn(user: User | string): string {
  //   return typeof user === 'string' ? user : user?.mobileNumber || '';
  // }

  // getAllCategories() {
  //   this.categoryService.searchCategories('', 0, 5).subscribe({
  //     next: (response) => {
  //       this.categories = response.body?.data?.dataList || response.data?.dataList || response.dataList || [];
  //       this.cdr.markForCheck();
  //     },
  //     error: (error) => {
  //       console.error('Error loading categories:', error);
  //       this.categories = [];
  //       this.cdr.markForCheck();
  //       this.snackbarService.openWarning(error.error?.message || 'Failed to load categories');
  //     }
  //   });
  // }

  // getAllUsers() {
  //   this.userService.searchActiveUsers('', 0, 5).subscribe({
  //     next: (response) => {
  //       this.users = response.body?.data?.dataList || response.data?.dataList || response.dataList || [];
  //       this.cdr.markForCheck();
  //     },
  //     error: (error) => {
  //       console.error('Error loading users:', error);
  //       this.users = [];
  //       this.cdr.markForCheck();
  //       this.snackbarService.openWarning(error.error?.message || 'Failed to load users');
  //     }
  //   });
  // }

  getAllTypes() {
    this.advertiseTypeService.getAll().subscribe({
      next: (response) => {
        this.types = response.body?.data || response.data || response || [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading types:', error);
        this.types = [];
        this.cdr.markForCheck();
        this.snackbarService.openWarning(error.error?.message || 'Failed to load types');
      }
    });
  }

  // getAllCities() {
  //   this.citiesService.searchCities('', 0, 5).subscribe({
  //     next: (response) => {
  //       this.cities = response.body?.data?.dataList || response.data?.dataList || response.dataList || [];
  //       this.cdr.markForCheck();
  //     },
  //     error: (error) => {
  //       console.error('Error loading cities:', error);
  //       this.cities = [];
  //       this.cdr.markForCheck();
  //       this.snackbarService.openWarning(error.error?.message || 'Failed to load cities');
  //     }
  //   });
  // }

  onSave(): void {

    // if (this.slotForm.valid && this.selectedCategory && this.selectedUser && this.slotForm.value.type) {
    //   this.isLoading = true;

      // const formData = new FormData();
      // formData.append('title', this.slotForm.value.adTitle);
      // formData.append('whatsapp', this.slotForm.value.whatsapp.toString());
      // formData.append('telegram', this.slotForm.value.telegram.toString());
      // formData.append('viber', this.slotForm.value.viber.toString());
      // formData.append('imo', this.slotForm.value.imo.toString());
      // formData.append('verify', 'false');
      // formData.append('categoryID', this.selectedCategory.propertyId);
      // formData.append('description', this.slotForm.value.description);
      // this.selectedCities.forEach((city) => {
      //   formData.append('cityIds', city.propertyID);
      // });
      // formData.append('userId', this.selectedUser.propertyId);
      // formData.append('adType', this.slotForm.value.type);
      // formData.append('serviceFee', this.slotForm.value.serviceFee.toString());
      // this.selectedFiles.forEach((file) => {
      //   formData.append('images', file);
      // });
      // this.selectedPaymentSlips.forEach((file) => {
      //   formData.append('paymentSlips', file);
      // });

    if (this.slotForm.valid && this.slotForm.value.type) {
      this.isLoading = true;

    const formData = new FormData();

    formData.append('advertisementId', this.advertisement.propertyId);
    formData.append('description', this.slotForm.value.description);
    formData.append('adType', this.slotForm.value.type);
    formData.append('serviceFee', this.slotForm.value.serviceFee.toString());
    this.selectedPaymentSlips.forEach((file) => {
      formData.append('slips', file);
    });

      this.generalAdvertisementProcessService.createProcess(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.snackbarService.openSuccess(res.message);
          this.cdr.markForCheck();
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          console.error('Error processing advertisement:', error);
          this.snackbarService.openWarning(error.error?.message || 'Failed to process advertisement');
        }
      });
    } else {
      Object.keys(this.slotForm.controls).forEach(key => {
        this.slotForm.get(key)?.markAsTouched();
      });
      // if (!this.selectedCategory) {
      //   this.snackbarService.openWarning('Please select a valid category');
      // }
      // if (!this.selectedUser) {
      //   this.snackbarService.openWarning('Please select a valid user');
      // }
      if (!this.slotForm.value.type) {
        this.snackbarService.openWarning('Please select a valid advertisement type');
      }
      this.cdr.markForCheck();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
