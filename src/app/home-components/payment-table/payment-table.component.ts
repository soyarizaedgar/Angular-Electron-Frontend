import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletsService } from 'src/app/services/wallets.service';

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

  range = [1,2,3,4,5,6,7,8,9,10]
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

  constructor(private wallets: WalletsService) {
    
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
      let date_ = this.formatDate(new Date(this.date))
      this.wallets.getInitialAmount(this.walletId, {date: date_}).subscribe(response =>{
        this.initialamount = this.currentwallet.initial_amount + response.total_amount
        this.totalavailable =  this.initialamount + this.totalincomes + this.totalexpenses
      })
    })
  }

  updateAmounts(){
    this.wallets.updateWallet({name: 'TDC NU'}, this.walletId).subscribe( response =>{
      console.log(response)
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
  
}
