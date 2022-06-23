import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {

  wallets$ = new EventEmitter<any>();

  events$ = new EventEmitter<any>();

  constructor() { }

}
