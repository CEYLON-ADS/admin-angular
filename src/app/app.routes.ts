import {Routes} from '@angular/router';
import {MainContext} from './component/core/main-context/main-context';
import {DashboardDefault} from './component/dashobard/default/dashboard-default/dashboard-default';
import {SettingComponent} from './component/dashobard/settings/setting-component/setting-component';
import {StaticComponent} from './component/dashobard/static/static-component/static-component';
import {
  AdvertisementComponent
} from './component/dashobard/advertisement/advertisement-component/advertisement-component';
import {
  CategoryManagementComponent
} from './component/dashobard/category/category-management-component/category-management-component';
import {UserManagementComponent} from './component/dashobard/user/user-management-component/user-management-component';
import {LoginComponent} from './component/security/security/components/login-component/login-component';
import {SecurityContext} from './component/security/security/components/security-context/security-context';
import {VerifyComponent} from './component/security/security/components/verify-component/verify-component';
import {
  PendingAdsComponents
} from './component/dashobard/advertisement/advertisement-component/inner/pending-ads-components/pending-ads-components';
import {
  RejectedAdsComponents
} from './component/dashobard/advertisement/advertisement-component/inner/rejected-ads-components/rejected-ads-components';
import {
  FakeAdsComponents
} from './component/dashobard/advertisement/advertisement-component/inner/fake-ads-components/fake-ads-components';
import {
  VerifiedAdsComponents
} from './component/dashobard/advertisement/advertisement-component/inner/verified-ads-components/verified-ads-components';
import {
  ActiveUsersComponent
} from './component/dashobard/user/user-management-component/inner/active-users-component/active-users-component';
import {
  BlackListedUsersComponent
} from './component/dashobard/user/user-management-component/inner/black-listed-users-component/black-listed-users-component';
import {
  AllCategories
} from './component/dashobard/category/category-management-component/inner/all-categories/all-categories';
import {NewAds} from './component/dashobard/advertisement/advertisement-component/inner/new-ads/new-ads';
import {ErrorPageComponent} from './component/core/error-page-component/error-page-component';
import {authGuard} from './guard/auth-guard';
import {
  SlotAdvertisements
} from './component/dashobard/advertisement/advertisement-component/inner/slot-advertisements/slot-advertisements';
import {
  AdvertisementsSlots
} from './component/dashobard/advertisement/advertisement-component/inner/advertisements-slots/advertisements-slots';
import {Locations} from './component/dashobard/locations/locations/locations';
import {Districts} from './component/dashobard/locations/locations/inner/districts/districts';
import {Cities} from './component/dashobard/locations/locations/inner/cities/cities';
import {CategoryRevenue} from './component/dashobard/static/static-component/inner/category-revenue/category-revenue';
import {ComplainManagementComponent} from './component/dashobard/complains/complain-management-component/complain-management-component';
import {AllComplaintsComponent} from './component/dashobard/complains/complain-management-component/inner/all-complaints-component/all-complaints-component';
import {CountryComponent} from './component/dashobard/locations/locations/inner/country/country';


export const routes: Routes = [
  {path: '', redirectTo: '/security/login', pathMatch: 'full'},
  {path: 'error', component: ErrorPageComponent},
  {
    path: 'security', component: SecurityContext, children: [
      {path: '', redirectTo: '/security/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'verify', component: VerifyComponent}
    ]
  },
  {
    path: 'process', component: MainContext, canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardDefault},
      {
        path: 'advertisements', component: AdvertisementComponent, children: [
          {path: '', redirectTo: '/process/advertisements/pending', pathMatch: 'full'},
          {path: 'pending', component: PendingAdsComponents},
          {path: 'new', component: NewAds},
          {path: 'rejected-ads', component: RejectedAdsComponents},
          {path: 'fake-ads', component: FakeAdsComponents},
          {path: 'verified', component: VerifiedAdsComponents},
          {path: 'slot-advertisements', component: SlotAdvertisements},
          {path: 'advertise-slots', component: AdvertisementsSlots}
        ]
      },
      {
        path: 'users', component: UserManagementComponent, children: [
          {path: '', redirectTo: '/process/users/active', pathMatch: 'full'},
          {path: 'active', component: ActiveUsersComponent},
          {path: 'black-listed', component: BlackListedUsersComponent}
        ]
      },
      {
        path: 'locations', component: Locations, children: [
          {path: '', redirectTo: '/process/locations/countries', pathMatch: 'full'},
          {path: 'countries', component: CountryComponent},
          {path: 'districts', component: Districts},
          {path: 'cities', component: Cities}
        ]
      },
      {
        path: 'categories', component: CategoryManagementComponent, children: [
          {path: '', redirectTo: '/process/categories/all', pathMatch: 'full'},
          {path: 'all', component: AllCategories}
        ]
      },
      {
        path: 'complains', component: ComplainManagementComponent, children: [
          {path: '', redirectTo: '/process/complains/all', pathMatch: 'full'},
          {path: 'all', component: AllComplaintsComponent}
        ]
      },
      {
        path: 'revenue', component: StaticComponent, children: [
          {path: '', redirectTo: '/process/revenue/category-revenue', pathMatch: 'full'},
          {path: 'category-revenue', component: CategoryRevenue},
          // {path: 'girls-personal', component: GirlsPersonal},
          // {path: 'girls-personal', component: GirlsPersonal},
          // {path: 'secret', component: Secret},
          // {path: 'couples', component: Couples},
          // {path: 'chat', component: ChatComponent},
          // {path: 'live-cam', component: LiveCam},
          // {path: 'spa', component: Spa},
          // {path: 'boys-personal', component: BoysPersonal},
          // {path: 'transgender', component: Transgender},
          // {path: 'rent', component: Rent},
          // {path: 'sale', component: Sale},
          // {path: 'toys-accessories', component: ToysAccessories},
          // {path: 'medicine', component: Medicine},
          // {path: 'rooms', component: Rooms},
          // {path: 'lankan-jobs', component: LankanJobs}
        ]
      }
    ],
  },

];
