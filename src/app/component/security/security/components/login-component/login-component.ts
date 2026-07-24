import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {Router} from '@angular/router';
import {AuthService} from '../../../../../service/auth/auth-service';
import {RequestApplicationUserLoginDTO} from '../../../../../dto/request-application-user-login-dto';
import {SnackbarService} from '../../../../../service/snackbar/snackbar.service';
import {CookieManagerService} from '../../../../../service/cookie/cookie-manager.service';


@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  passwordForm: FormGroup;
  loginMode: 'otp' | 'password' = 'otp';
  mobileNumber:string = "";

  countryCodes = ['+94', '+91'];

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private snackbarService:SnackbarService,
    private router:Router,
    private cookieManagerService:CookieManagerService

  ) {
    this.loginForm = this.fb.group({
      code: ['+94', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{7,12}$')]]
    });

    this.passwordForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(  this.cookieManagerService.tokenIsExists("ceylonAddAdminToken")){
      this.router.navigate(['/process/dashboard']);
    }
  }

  setMode(mode: 'otp' | 'password') {
    this.loginMode = mode;
  }

  onSubmit() {


    this.mobileNumber = this.loginForm.value.code + this.loginForm.value.phone;

    if (this.loginForm.valid) {
      const dto:RequestApplicationUserLoginDTO  = {
        mobileNumber:this.mobileNumber
      }

      this.authService.login(dto).subscribe({
        next: (response) => {
          this.snackbarService.openSuccess(response.body.message);
          this.router.navigate(['/security/verify'], { queryParams: { mobileNumber:this.mobileNumber } });
        },
        error: (error) => {
          console.error('error', error);
          this.snackbarService.openWarning(error.error.message);
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      const dto = {
        username: this.passwordForm.value.username,
        password: this.passwordForm.value.password
      };

      this.authService.loginWithPassword(dto).subscribe({
        next: (response) => {
          this.snackbarService.openSuccess(response.body.message);
          if (response.body.data?.token) {
            this.cookieManagerService.setToken(response.body.data.token, "ceylonAddAdminToken");
          }
          this.router.navigate(['/process/dashboard']);
        },
        error: (error) => {
          console.error('error', error);
          this.snackbarService.openWarning(error.error?.message || "Login failed");
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

}
