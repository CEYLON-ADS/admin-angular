import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login-component/login-component';
import {VerifyComponent} from './components/verify-component/verify-component';
import {SecurityContext} from './components/security-context/security-context';

const routes: Routes = [

  {path: '', redirectTo: '/security/process/login', pathMatch: 'full'},
  {
    path: 'process', component: SecurityContext, children:
      [
        {path: '', redirectTo: '/security/process/login', pathMatch: 'full'},
        {path:'login', component:LoginComponent},
        {path:'forgot',component:VerifyComponent},

      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
