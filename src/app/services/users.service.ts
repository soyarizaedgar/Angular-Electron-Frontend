import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  Apiurl = 'https://biyuyoapi.herokuapp.com/'
  // check if token is expired
  helper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  signup(user:Object){
    return this.http.post<Object>( this.Apiurl + 'user', user)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        })
      )
  }

  signin(data:Object){
    return this.http.post<Object>( this.Apiurl + 'signin', data)
      .pipe(
        map((data:any)=>{
        localStorage.setItem('access-token', data.token)
        localStorage.setItem('user_id', data.user_id)
        this.router.navigateByUrl('/home')
      }))  
  }

  isLogged(){
    return localStorage.getItem('access-token') !== null
    && localStorage.getItem('user_id') !== null
  }

  isTokenExpired(){
    const token = localStorage.getItem('access-token') || undefined;
    const isExpired = this.helper.isTokenExpired(token);
    return isExpired
  }

  getUser(userId:string){
    return this.http.get( this.Apiurl + 'user/' + userId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  updateUser(userId:string, Object:object){
    return this.http.put( this.Apiurl + 'user/' + userId, Object)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  updatepwd(userId:string, Object:object){
    return this.http.put( this.Apiurl + 'userpwd/' + userId, Object)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  forgotpassword(email:string){
    return this.http.post<Object>( this.Apiurl + 'forgot-password', email)
    .pipe(
      tap(()=>{
        this._refresh$.next();
      })
    )
  }

  resetpasssword(object: object, userId:string){
    return this.http.put( this.Apiurl + 'reset-password/' + userId, object)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }
}
