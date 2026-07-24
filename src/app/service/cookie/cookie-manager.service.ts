import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor(private cookieService: CookieService,
              private router: Router) {
  }

  public setToken(token: string, name:string) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 9); // Set cookie to expire in 9 hours
    this.cookieService.set(name,
      token,
      expiryDate,'/');
  }

  public tokenIsExists(name: string): boolean {
    return this.cookieService.check(name);
  }
  public clearToken(name:string) {
    if (this.tokenIsExists(name)){
      this.cookieService.delete(name);
    }
  }

  public clearAll() {
      this.cookieService.deleteAll('/');
  }

  public getToken(name:string): string {
    return this.cookieService.get(name);
  }

  public tokenIsExistsWithPromise(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const exists = this.cookieService.check(name);
        resolve(exists);
      } catch (error) {
        reject(error);
      }
    });
  }

}
