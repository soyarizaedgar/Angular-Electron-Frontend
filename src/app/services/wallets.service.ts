import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  constructor(private http: HttpClient, private router: Router) { }

  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }
  // WALLETS

  
  getAllWallets(userId:string){
    return this.http.get('http://localhost:3001/wallets/' + userId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  createWallet(wallet:Object){
    return this.http.post('http://localhost:3001/wallet', wallet)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  // Events

  getAllEvents(userId:string){
    return this.http.get('http://localhost:3001/events/' + userId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  createEvent(move:Object){
    return this.http.post('http://localhost:3001/event', move)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }


}
