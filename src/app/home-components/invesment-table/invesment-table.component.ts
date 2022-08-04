import { Component,OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletsService } from 'src/app/services/wallets.service';
import { EventModalComponent } from '../event-modal/modal.component';
import {MatDialog} from '@angular/material/dialog';
import { ObservableService } from 'src/app/services/observable.service';
import { WalletModalComponent } from '../wallet-modal/wallet-modal.component';


@Component({
  selector: 'app-invesment-table',
  templateUrl: './invesment-table.component.html',
  styleUrls: ['./invesment-table.component.scss']
})
export class InvesmentTableComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  currentwallet:any

  eventsList:any = []
  todaysDate:Date = new Date();
  walletId:any = localStorage.getItem('wallet_id');
  
  date  = this.formatDate(this.todaysDate)
  maxdate = this.date
  mindate = this.getMinDate(this.todaysDate)

  ishide = true
  url:string = ''

  constructor(private wallets: WalletsService, public modal: MatDialog, private observable: ObservableService) { }

  hideNav(){
    this.ishide = !this.ishide
    return this.ishide
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

  getWallet(){
    this.wallets.getOneWallet(this.walletId).subscribe(response =>{
      this.currentwallet = response
    })
  }

  getMonthEvents(){
    this.wallets.getMonthEvents(this.walletId, {date: this.date}).subscribe(response =>{
      this.eventsList = response
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

  getClickedEvent(event:object){
    this.observable.event$.emit(event)
  }

  openModal(isEdit:boolean){
    this.modal.open(EventModalComponent)
    this.observable.isInvest$.emit(true)
  }

  openWalletModal(){
    this.modal.open(WalletModalComponent);
    this.observable.wallet$.emit(this.currentwallet)
  }
  
}

