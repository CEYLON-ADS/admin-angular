import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CountryDto} from '../../dto/CountryDto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public createCountry(data: CountryDto, date: any): Observable<any> {
    return this.http.post(this.baseUrl + "api/v1/countries/admin/create", {
      capital: data?.capital,
      continentCode: data?.continentCode,
      createdDate: date,
      continentName: data?.continentName,
      dialCode: data?.dialCode,
      countryCode: data?.countryCode,
      countryName: data?.countryName,
      currencyCode: data?.currencyCode,
      currencyName: data?.currencyName,
      currencySymbol: data?.currencySymbol
    })
  }
  public updateBasicData(data: CountryDto, id:any): Observable<any> {
    return this.http.post(this.baseUrl + "api/v1/countries/admin/update-basic-data/"+id, {
      capital: data?.capital,
      continentCode: data?.continentCode,
      continentName: data?.continentName,
      dialCode: data?.dialCode,
      countryCode: data?.countryCode,
      countryName: data?.countryName,
      currencyCode: data?.currencyCode,
      currencyName: data?.currencyName,
      currencySymbol: data?.currencySymbol
    })
  }

  public loadCountries(searchText: any, page: any, size: any): Observable<any> {

    let params = new HttpParams();
    params = params.append('searchText', searchText);
    params = params.append('page', page);
    params = params.append('size', size);

    return this.http.get(this.baseUrl + "api/v1/countries/admin/list",
      {params: params})
  }



  public updateCountryStatus(id: any, status: boolean): Observable<any> {

    let params = new HttpParams();
    params = params.append('state', status);

    return this.http.put(this.baseUrl + "api/v1/countries/admin/update-state/" + id,
      {}, {params: params})
  }


  public deleteCountry(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + "api/v1/countries/admin/delete-country/" + id)
  }
}
