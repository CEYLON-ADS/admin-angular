import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Router} from '@angular/router';
import {SnackbarService} from '../../../../../service/snackbar/snackbar.service';
import {RequestApplicationUserOtpDTO} from '../../../../../dto/request-application-user-otp-dto';
import {AuthService} from '../../../../../service/auth/auth-service';
import { ActivatedRoute } from '@angular/router';
import {CookieManagerService} from '../../../../../service/cookie/cookie-manager.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-verify-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './verify-component.html',
  standalone: true,
  styleUrl: './verify-component.scss'
})
export class VerifyComponent implements OnInit{
  otpForm: FormGroup;
  otpSent: boolean = true; // simulate "OTP has been sent"
  mobileNumber:string = '';


  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private snackbarService:SnackbarService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private cookieManagerService:CookieManagerService,
    private cookieService:CookieService

  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.mobileNumber = params['mobileNumber'];

    });
  }

  onVerify() {
    if (this.otpForm.valid) {

      const dto:RequestApplicationUserOtpDTO = {
        mobileNumber:this.mobileNumber,
        otp:this.otpForm.value.otp
      }

      this.authService.verifyOtp(dto).subscribe({
        next: (response) => {
          console.log("response" , response);
          this.snackbarService.openSuccess(response.body.message);
          this.cookieManagerService.setToken(response?.body?.data?.token,"ceylonAddAdminToken")
          this.cookieService.set("ceylonAddAdminID", response?.body?.data?.userId);
          this.router.navigate(['/process/dashboard']);
        },
        error: (error) => {
          console.error('error', error);
          this.snackbarService.openWarning(error.error.message);
        }
      });

    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  onRequestAgain() {
    this.router.navigate(['/security/login']);
  }


}
