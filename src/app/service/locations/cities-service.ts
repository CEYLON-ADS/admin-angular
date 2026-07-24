import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface CityRequestDTO {
  name: string;
  districtId: string; // assuming each city belongs to a district
}

export interface City {
  cityId: string; // UUID from backend
  name: string;
  districtId: string;
}

export interface PaginateCityDTO {
  content: City[];
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
export class CitiesService {

  private baseUrl = environment.baseUrl + 'api/v1/cities';

  constructor(private http: HttpClient) { }

  // ✅ Create city
  public createCity(dto: CityRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // ✅ Search cities
  public searchCities(searchText?: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchText && searchText.trim()) {
      params = params.set('searchText', searchText.trim());
    }

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  // 🔹 Update city
  public updateCity(cityId: string, dto: CityRequestDTO): Observable<StandardResponseDTO<any>> {
    return this.http.put<StandardResponseDTO<any>>(`${this.baseUrl}/${cityId}`, dto);
  }

  // 🔹 Delete city
  public deleteCity(cityId: string): Observable<StandardResponseDTO<any>> {
    return this.http.delete<StandardResponseDTO<any>>(`${this.baseUrl}/${cityId}`);
  }

  // 🔹 Get city by ID
  public getCityById(cityId: string): Observable<StandardResponseDTO<City>> {
    return this.http.get<StandardResponseDTO<City>>(`${this.baseUrl}/${cityId}`);
  }
}
