import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { CookieManagerService } from '../../../service/cookie/cookie-manager.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatTooltip
  ],
  templateUrl: './main-sidebar.html',
  styleUrl: './main-sidebar.scss'
})
export class MainSidebar {
  constructor(
    private cookieManager: CookieManagerService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  onLogout(): void {
    this.cookieManager.clearToken('ceylonAddAdminToken');
    this.cookieService.delete('ceylonAddAdminID', '/');
    this.router.navigateByUrl('/security/login');
  }
}
