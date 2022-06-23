import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

import { WalletsService } from 'src/app/services/wallets.service';

export interface Wallet {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class EventModalComponent implements OnInit {

  walletsList:any = []
  userId:any = localStorage.getItem('user_id');
  paymentForm!: FormGroup;
  activityForm!: FormGroup;

  isPayment = true

  control = new FormControl('');
  filteredWallets!: Observable<Wallet[]>;

  constructor(private wallets: WalletsService){
    this.filteredWallets = this.control.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterWallets(state) : this.walletsList.slice())),
    );
  }

  ngOnInit(): void {

    this.getWallets()
    
    this.paymentForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'amount': new FormControl(null,[Validators.required]),
      'date': new FormControl(null, [Validators.required]),
      'wallet_id': new FormControl(null,[Validators.required]),
    });

    this.activityForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'date': new FormControl(null, [Validators.required]),
    });
    
  }

  private _filterWallets(value: string): Wallet[] {
    const filterValue = value.toLowerCase();
    return this.walletsList.filter((wallet: { name: string; }) => wallet.name.toLowerCase().includes(filterValue));
  }

  getWallets(){
    this.wallets.getAllWallets(this.userId).subscribe(response =>{
      response.forEach((element: any) => {
        this.walletsList.push({
          _id : element._id,
          name: element.name })});
    });
  }

  isPaymentToogle(value: boolean){
    this.isPayment = value
  }

  click_sub(){
    const payment = this.paymentForm.value
    const object = {
      ... payment,
      user_id: this.userId,
      amount: this.paymentForm.value.amount * -1
    }

    this.wallets.createEvent(object).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
    
  }
  
}
