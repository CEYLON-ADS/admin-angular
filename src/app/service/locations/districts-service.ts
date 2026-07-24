import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface DistrictRequestDTO {
  name: string;
  countryId: string;
}

export interface District {
  districtId: string; // UUID from backend
  name: string;
}

export interface PaginateDistrictDTO {
  content: District[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface StandardResponseDTO<T = any> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {

  private baseUrl = environment.baseUrl + 'api/v1/districts';

  constructor(private http: HttpClient) { }

  // ✅ Keep as you had
  public createDistricts(dto: DistrictRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // ✅ Keep as you had
  public searchDistricts(searchText?: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchText && searchText.trim()) {
      params = params.set('searchText', searchText.trim());
    }

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  // 🔹 Update district
  public updateDistrict(districtId: string, dto: DistrictRequestDTO): Observable<StandardResponseDTO<any>> {
    return this.http.put<StandardResponseDTO<any>>(`${this.baseUrl}/${districtId}`, dto);
  }

  // 🔹 Delete district
  public deleteDistrict(districtId: string): Observable<StandardResponseDTO<any>> {
    return this.http.delete<StandardResponseDTO<any>>(`${this.baseUrl}/${districtId}`);
  }

  // 🔹 Get district by ID
  public getDistrictById(districtId: string): Observable<StandardResponseDTO<District>> {
    return this.http.get<StandardResponseDTO<District>>(`${this.baseUrl}/${districtId}`);
  }
}
