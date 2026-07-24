import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SlotAdRequestDTO} from '../../dto/slot-ad-request-dto';

@Injectable({
  providedIn: 'root'
})

export class SlotAdService {
  private baseUrl = environment.baseUrl + 'api/v1/slot-ads';

  constructor(private http: HttpClient) {}

  public createSlotAd(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }
  // Get slot advertisement by ID
  public getSlotAdById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

// Update slot advertisement
  public updateSlotAd(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  // Change active status
  public changeActiveStatus(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status`, {});
  }

  // Delete slot advertisement
  public deleteSlotAd(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Search slot advertisements (with pagination)
  public searchSlotAds(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
