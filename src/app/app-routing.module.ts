import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './home-components/calendar/calendar.component';
import { ConfigUserComponent } from './home-components/config-user/config-user.component';
import { InvesmentTableComponent } from './home-components/invesment-table/invesment-table.component';

import { MainComponent } from './home-components/main/main.component';

import { PaymentTableComponent } from './home-components/payment-table/payment-table.component';
import { HomeComponent } from './maincomponents/home/home.component';
import { RegisterComponent } from './maincomponents/register/register.component';
import { ResetPasswordComponent } from './maincomponents/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  {path: 'signin', component: RegisterComponent, pathMatch: 'full'},
  {path: 'home', canActivate:[AuthGuard], component: HomeComponent, 
    children:
    [
      {path: '',canActivate:[AuthGuard], component: MainComponent, pathMatch: 'full'},
      {path: 'calendar',canActivate:[AuthGuard], component:CalendarComponent, pathMatch: 'full'},
      {path: 'wallets',canActivate:[AuthGuard], component:PaymentTableComponent, pathMatch: 'full'},
      {path: 'invesments',canActivate:[AuthGuard], component:InvesmentTableComponent, pathMatch: 'full'},
      {path: 'userconfig',canActivate:[AuthGuard], component:ConfigUserComponent, pathMatch: 'full'}
    ]},
    {path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
