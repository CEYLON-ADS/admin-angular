import {CanActivateFn, Router} from '@angular/router';
import {CookieManagerService} from '../service/cookie/cookie-manager.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const cookieService = inject(CookieManagerService)
  const router = inject(Router)
  try {
    const hasValidToken = await cookieService.tokenIsExistsWithPromise('ceylonAddAdminToken');

    if (hasValidToken) {
      return true; // Allow navigation
    } else {
      router.navigateByUrl('/security/login');
      return false; // Optional and not necessary due to navigation
    }
  } catch (error) {
    console.error('Error checking token:', error);
    router.navigateByUrl('/error'); // Redirect to error page
    return false;// Optional and not necessary due to navigation
  }
};
