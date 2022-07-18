import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { UsersService } from "./users.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private users:UsersService, public router: Router){}

  closeSesion(){
    localStorage.removeItem('access-token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('wallet_id');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isUserLogged = this.users.isLogged();
    const isTokenExpired = this.users.isTokenExpired();

    if (!isUserLogged || isTokenExpired) {
      this.router.navigate(['signin']);
      this.closeSesion();
    }
    return isUserLogged;
  }
  
}
