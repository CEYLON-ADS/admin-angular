import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";
import {CookieManagerService} from '../service/cookie/cookie-manager.service';
import {SnackbarService} from '../service/snackbar/snackbar.service';

export const httpManagerInterceptor: HttpInterceptorFn = (req, next) => {

  let snackbarService = inject(SnackbarService);
  let cookieService = inject(CookieManagerService);
  let router = inject(Router);

  if(cookieService.tokenIsExists('ceylonAddAdminToken')){
    const token = cookieService.getToken('ceylonAddAdminToken');
    req = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let code = error?.error?.code;
      let message = error?.error?.message;

      // Handle login errors
      if(req.url.includes('/security/login')){
        if (code == 401){
          snackbarService.openWarning('Invalid username or password!','Close');
        }
        return throwError(() => error);
      }

      // Handle admin verification errors - BE MORE SPECIFIC
      if(req.url.includes('/verify-admin')){
        if (code == 400){
          snackbarService.openWarning('You are not an admin!','Close');
          cookieService.clearToken('ceylonAddAdminToken');
          // cookieService.clearToken('refresh_token');
        } else if (code == 401 || code == 403) { // Only redirect on auth errors
          snackbarService.openWarning('Please log in!','Close');
          cookieService.clearToken('ceylonAddAdminToken');
          // cookieService.clearToken('refresh_token');

          // Prevent redirect loop by checking current route
          if (!router.url.includes('/security/login')) {
            router.navigateByUrl('/security/login');
          }
        }
        return throwError(() => error);
      }

      // Handle other common errors
      if (code == 409){
        snackbarService.openWarning(message,'Close');
      }

      if (code == 500){
        snackbarService.openWarning('Something went wrong, please try again later!','Close');
      }

      if (error?.status == 413){
        snackbarService.openWarning('The selected file was too large..','Close');
      }

      return throwError(() => error);
    }),
  );
};
