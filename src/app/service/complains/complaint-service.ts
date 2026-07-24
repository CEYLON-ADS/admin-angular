import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// DTO definitions - moved outside the service class
export interface ComplaintRequestDTO {
  message: string;
  generalAdId: string; // UUID from backend, represented as string in TS
}

export interface ComplaintRemarkRequestDTO {
  remark: string;
  userId: string; // UUID from backend, represented as string in TS
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseUrl = environment.baseUrl + 'api/v1/complaints';

  constructor(private http: HttpClient) { }

  // Create complaint
  public createComplaint(dto: ComplaintRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Update complaint
  public updateComplaint(complaintId: string, dto: ComplaintRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${complaintId}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Delete complaint
  public deleteComplaint(complaintId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${complaintId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Add remark to complaint
  public addRemark(complaintId: string, dto: ComplaintRemarkRequestDTO): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${complaintId}/remark`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Get complaint by ID
  public getComplaintById(complaintId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${complaintId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Search complaints
  public searchComplaints(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search?searchText=${searchText}&page=${page}&size=${size}`,
      { observe: 'response' as 'body' }
    ).pipe(map(data => data));
  }
}
