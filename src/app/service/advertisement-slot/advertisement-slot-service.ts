import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdvertisementSlotRequestDTO } from '../../dto/AdvertisementSlotRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementSlotService {
  private baseUrl = environment.baseUrl + 'api/v1/advertisement-slots';

  constructor(private http: HttpClient) {}

  // Create advertisement slot
  public createSlot(dto: AdvertisementSlotRequestDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}`, dto);
  }

  // Get slot by ID
  public getSlotById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Update advertisement slot
  public updateSlot(id: string, dto: AdvertisementSlotRequestDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  // Update active status
  public changeActiveStatus(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, {});
  }

  // Update availability status
  public changeAvailabilityStatus(id: string, status: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/availability`, null, {
      params: { status: status.toString() }
    });
  }

  // Delete slot
  public deleteSlot(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Get slots by category
  public getByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${categoryId}`);
  }

  // Search advertisement slots (with pagination)
  public searchSlots(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
