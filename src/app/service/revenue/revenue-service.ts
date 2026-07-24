import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private baseUrl = environment.baseUrl + 'api/v1/revenues';

  constructor(private http: HttpClient) {}

  // Get revenue between time period
  public getRevenue(categoryId: string, startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('categoryId', categoryId)
      .set('startDate', startDate)   // format: YYYY-MM-DD
      .set('endDate', endDate);      // format: YYYY-MM-DD

    return this.http.get(`${this.baseUrl}`, { params });
  }
}
