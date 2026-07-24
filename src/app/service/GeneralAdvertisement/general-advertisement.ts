import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralAdvertisementService {
  private baseUrl = environment.baseUrl + 'api/v1/advertisements';

  constructor(private http: HttpClient) {}

  // Create advertisement
  public createAdvertisement(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  // Update advertisement (using FormData)
  public updateAdvertisement(adId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${adId}`, formData);
  }

  // Delete advertisement
  public deleteAdvertisement(adId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${adId}`);
  }

  // Get advertisement by ID
  public getAdvertisementById(adId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${adId}`);
  }

  // Get advertisements by User ID with pagination
  public getAdvertisementsByUserId(userId: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Search advertisements
  public searchAdvertisements(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Mark advertisement as fake
  public markAsFake(adId: string, markedBy: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${adId}/mark-fake`, null, {
      params: { markedBy }
    });
  }

  // Unmark advertisement as fake
  public unmarkAsFake(adId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${adId}/unmark-fake`, {});
  }

  // Verify advertisement
  public verifyAdvertisement(adId: string, verifiedBy: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify/${adId}`, null, {
      params: { verifiedBy }
    });
  }

  // Reject advertisement
  public rejectAdvertisement(adId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject/${adId}`, {});
  }

  // Toggle fake status
  public toggleFakeStatus(adId: string, fakeStatus: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/fake-status/${adId}`, null, {
      params: { fakeStatus }
    });
  }

  // Search fake advertisements
  public searchFakeAdvertisements(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/fake`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Search rejected advertisements
  public searchRejectedAdvertisements(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/rejected`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Search verified advertisements
  public searchVerifiedAdvertisements(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/verified`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }

  // Search unverified advertisements
  public searchUnverifiedAdvertisements(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/unverified`, {
      params: {
        searchText: searchText,
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
