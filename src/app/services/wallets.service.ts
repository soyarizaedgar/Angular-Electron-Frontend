import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  Apiurl = 'https://biyuyoapi.herokuapp.com/'
  constructor(private http: HttpClient, private router: Router) { }

  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }
  // WALLETS

  
  getAllWallets(userId:string){
    return this.http.get(this.Apiurl + 'wallets/' + userId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  getOneWallet(walletId:string){
    return this.http.get(this.Apiurl + 'wallet/' + walletId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  createWallet(wallet:Object){
    return this.http.post(this.Apiurl + 'wallet', wallet)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  updateWallet(event:Object, walletId:string){
    return this.http.put(this.Apiurl + 'wallet/' + walletId, event)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  deleteWallet(walletId:string){
    return this.http.delete(this.Apiurl + 'wallet/' + walletId)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  // Events

  getAllEvents(userId:string){
    return this.http.get(this.Apiurl + 'events/' + userId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  getTotalAmount(walletId:string){
    return this.http.get(this.Apiurl + 'events_t/' + walletId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  getMonthEvents(walletId:string, month:Object){
    return this.http.post(this.Apiurl + 'events_m/' + walletId, month)
      .pipe(
        map((response:any) =>{
          return response;
      }));
  }

  getInitialAmount(walletId:string, month:object){
    return this.http.post(this.Apiurl + 'events_i/' + walletId, month)
      .pipe(
        map((response:any) =>{
          return response;
      }));
  }

  createEvent(event:Object){
    return this.http.post(this.Apiurl + 'event', event)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  updateEvent(event:Object, eventId:string){
    return this.http.put(this.Apiurl + 'event/' + eventId, event)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  deleteEvent(eventId:string){
    return this.http.delete(this.Apiurl + 'event/' + eventId)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  deleteManyEvents(walletId:string){
    return this.http.delete(this.Apiurl + 'events/' + walletId)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }



}
