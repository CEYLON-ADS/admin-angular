import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationUserRequestDTO } from '../../dto/application-user-request-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl + 'api/v1/users';

  constructor(private http: HttpClient) {}

  // Update user
  public updateUser(userId: string, dto: ApplicationUserRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${userId}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Delete user
  public deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${userId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Change active status
  public changeUserStatus(userId: string, active: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/status?active=${active}`, {}, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Get user by ID
  public getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Search all users
  public searchUsers(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search?searchText=${searchText}&page=${page}&size=${size}`,
      { observe: 'response' as 'body' }
    ).pipe(map(data => data));
  }

  // Search active users
  public searchActiveUsers(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/active-users/search?searchText=${searchText}&page=${page}&size=${size}`,
      { observe: 'response' as 'body' }
    ).pipe(map(data => data));
  }

  // Search blacklisted users
  public searchBlacklistedUsers(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/blacklisted-users/search?searchText=${searchText}&page=${page}&size=${size}`,
      { observe: 'response' as 'body' }
    ).pipe(map(data => data));
  }
}
