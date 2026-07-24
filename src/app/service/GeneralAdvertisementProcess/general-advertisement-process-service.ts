import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GeneralAdvertisementProcessService {
  private baseUrl = environment.baseUrl + 'api/v1/advertisement-processes';

  constructor(private http: HttpClient) {}

  public createProcess(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

// Update process (FormData must be prepared in the component)
  public updateProcess(processId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${processId}`, formData);
  }

  // Delete process
  public deleteProcess(processId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${processId}`);
  }

  // Change active status
  public changeActiveStatus(processId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${processId}/status`, {});
  }

  // Verify process
  public verifyProcess(processId: string, verifiedBy: string): Observable<any> {
    const params = new HttpParams().set('verifiedBy', verifiedBy);
    return this.http.patch(`${this.baseUrl}/${processId}/verify`, {}, { params });
  }

  // Change like status
  public changeLikeStatus(processId: string, status: boolean): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.patch(`${this.baseUrl}/${processId}/like`, {}, { params });
  }

  // Add view
  public createView(processId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${processId}/view`, {});
  }

  // Get process by ID
  public getProcessById(processId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${processId}`);
  }

  // Search processes with pagination
  public searchProcesses(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('searchText', searchText)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.baseUrl}/search`, { params });
  }
}
