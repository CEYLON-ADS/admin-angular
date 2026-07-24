import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AdvertiseTypeRequestDTO {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvertiseTypeService {
  private baseUrl = environment.baseUrl + 'api/v1/advertise-types';

  constructor(private http: HttpClient) {}

  // Initialize default advertise types
  public initializeTypes(): Observable<any> {
    return this.http.post(`${this.baseUrl}/init`, {});
  }

  // Create advertise type
  public create(dto: AdvertiseTypeRequestDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}`, dto);
  }

  // Get advertise type by ID
  public getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Update advertise type
  public update(id: string, dto: AdvertiseTypeRequestDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  // Delete advertise type
  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Get all advertise types
  public getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
