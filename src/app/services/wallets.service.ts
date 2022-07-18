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

  getOneWallet(walletId:string){
    return this.http.get('http://localhost:3001/wallet/' + walletId ).pipe(
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

  updateWallet(event:Object, walletId:string){
    return this.http.put('http://localhost:3001/wallet/' + walletId, event)
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

  getTotalAmount(walletId:string){
    return this.http.get('http://localhost:3001/events_t/' + walletId ).pipe(
      map((response:any) =>{
        return response;
    }));
  }

  getMonthEvents(walletId:string, month:Object){
    return this.http.post('http://localhost:3001/events_m/' + walletId, month)
      .pipe(
        map((response:any) =>{
          return response;
      }));
  }

  getInitialAmount(walletId:string, month:object){
    return this.http.post('http://localhost:3001/events_i/' + walletId, month)
      .pipe(
        map((response:any) =>{
          return response;
      }));
  }

  createEvent(event:Object){
    return this.http.post('http://localhost:3001/event', event)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  updateEvent(event:Object, eventId:string){
    return this.http.put('http://localhost:3001/event/' + eventId, event)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }

  deleteEvent(eventId:string){
    return this.http.delete('http://localhost:3001/event/' + eventId)
      .pipe(
        tap(()=>{
          this._refresh$.next();
        }))
  }



}
