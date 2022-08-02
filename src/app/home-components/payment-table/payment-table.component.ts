import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletsService } from 'src/app/services/wallets.service';
import { EventModalComponent } from '../event-modal/modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { ObservableService } from 'src/app/services/observable.service';
import { WalletModalComponent } from '../wallet-modal/wallet-modal.component';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent implements OnInit, OnDestroy  {

  expensesList:any = []
  incomesList:any = []
  subscription!: Subscription;
  currentwallet:any

  eventsList:any = []
  todaysDate:Date = new Date();
  walletId:any = localStorage.getItem('wallet_id');
  totalexpenses = 0
  totalincomes = 0
  totalavailable = 0
  initialamount = 0
  amountsList:any = []
  totalamount = 0
  
  date  = this.formatDate(this.todaysDate)
  maxdate = this.date
  mindate = this.getMinDate(this.todaysDate)

  ishide = true
  url:string = ''
  constructor(private wallets: WalletsService,public modal: MatDialog, private observable: ObservableService) {
    
  }
  
  hideNav(){
    this.ishide = !this.ishide
    return this.ishide
  }

  checkStatus(initial:number, final:number){
    if (initial > final) {
      this.url = '../../../assets/stonks-meme.jpg'
    }
    else{
      this.url = '../../../assets/malcom-meme.png'
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
  ngOnInit(): void {
    
    this.getMonthEvents()
    this.getWallet()
   
    this.subscription = this.wallets.refresh$.subscribe(()=>{
      this.getMonthEvents()
      this.getWallet()
    })
  }

  resetTable(){
    this.expensesList = []
    this.incomesList = []
    this.totalexpenses = 0
    this.totalincomes = 0
    this.totalavailable = 0
  }

  getWallet(){
    const month = new Date(this.date).getMonth()
    
    this.wallets.getOneWallet(this.walletId).subscribe(response =>{
      this.currentwallet = response
      this.checkStatus(this.currentwallet.initial_amount, this.totalamount)
      let date_ = this.formatDate(new Date(this.date))
      this.wallets.getInitialAmount(this.walletId, {date: date_}).subscribe(response =>{
        this.initialamount = this.currentwallet.initial_amount + response.total_amount
        this.totalavailable =  this.initialamount + this.totalincomes + this.totalexpenses
      })
    })
  }

  getMonthEvents(){
    this.resetTable()
    this.wallets.getMonthEvents(this.walletId, {date: this.date}).subscribe(response =>{

      this.eventsList = response
      this.eventsList.forEach((event:any) => {
        if (event.amount < 0){
          this.expensesList.push(event)
          this.totalexpenses += event.amount
        }
        else{
          this.incomesList.push(event)
          this.totalincomes += event.amount
        }
      })        
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
  }
  
  formatDate(utcdate:Date){
    const year = utcdate.getFullYear().toString()
    let month = (utcdate.getMonth() + 1).toString()
    if (month.length == 1) {
      month = month.padStart(2, '0')
    }
    const date_ = year.concat('-',month)
    return date_
  }

  getMinDate(utcdate:Date){
    const year = utcdate.getFullYear().toString()
    const month = '01'
    const date_ = year.concat('-',month)
    return date_
  }

  openModal(letter: string){
    switch (letter) {
      case 'W':
        this.modal.open(WalletModalComponent);
        this.observable.wallet$.emit(this.currentwallet)
        break;
      case 'E':
        this.modal.open(EventModalComponent);
        break;
    }
  }
  
}
