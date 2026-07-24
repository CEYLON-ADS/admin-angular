import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RequestApplicationUserLoginDTO } from '../../dto/request-application-user-login-dto';
import { RequestApplicationUserOtpDTO } from '../../dto/request-application-user-otp-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl + 'api/v1/auth';

  constructor(private http: HttpClient) { }

  // Send OTP
  public login(dto: RequestApplicationUserLoginDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => {
        return data;
      }));
  }

  // Verify OTP and get JWT token
  public verifyOtp(dto: RequestApplicationUserOtpDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-otp`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => {
        return data;
      }));
  }

  // Login with Username and Password
  public loginWithPassword(dto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login-password`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => {
        return data;
      }));
  }
}
