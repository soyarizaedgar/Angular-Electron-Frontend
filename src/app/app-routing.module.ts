import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './home-components/calendar/calendar.component';

import { MainComponent } from './home-components/main/main.component';

import { HomeComponent } from './maincomponents/home/home.component';
import { RegisterComponent } from './maincomponents/register/register.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  {path: 'signin', component: RegisterComponent, pathMatch: 'full'},
  {path: 'home', canActivate:[AuthGuard], component: HomeComponent, 
    children:
    [
      {path: '',canActivate:[AuthGuard], component: MainComponent, pathMatch: 'full'},
      {path: 'calendar',canActivate:[AuthGuard], component:CalendarComponent, pathMatch: 'full'},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
