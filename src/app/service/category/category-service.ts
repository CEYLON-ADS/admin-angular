import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryRequestDTO} from '../../dto/category-request-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.baseUrl + 'api/v1/categories';

  constructor(private http: HttpClient) { }

  // Create category
  public createCategory(dto: CategoryRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Update category
  public updateCategory(categoryId: string, dto: CategoryRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${categoryId}`, dto, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Delete category
  public deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${categoryId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Change active status
  public changeCategoryStatus(categoryId: string, active: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${categoryId}/status?active=${active}`, {}, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Get category by ID
  public getCategoryById(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${categoryId}`, { observe: 'response' as 'body' })
      .pipe(map(data => data));
  }

  // Search categories
  public searchCategories(searchText: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search?searchText=${searchText}&page=${page}&size=${size}`,
      { observe: 'response' as 'body' }
    ).pipe(map(data => data));
  }
}
