import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {

  event$ = new EventEmitter<object>();
  isEdit$ = new EventEmitter<boolean>();
  walletId$ = new EventEmitter<string>();

  constructor() { }

}
