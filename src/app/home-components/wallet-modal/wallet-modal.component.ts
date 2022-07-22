import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/observable.service';

import { WalletsService } from 'src/app/services/wallets.service';

@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.scss']
})
export class WalletModalComponent implements OnInit, OnDestroy{

  userId:any = localStorage.getItem('user_id');
  walletForm!: FormGroup;

  today = new Date();
  month = this.today.getMonth()

  sub!: Subscription
  clickedWallet:any
  isEdit = false
  isHide = false

  constructor(private wallets: WalletsService, private observable: ObservableService, private router: Router) {
    this.getClickedWallet()
   }

  ngOnInit(): void {
    this.walletForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'initial_amount': new FormControl(null,[Validators.required]),
      'type': new FormControl(null, [Validators.required])
    });
  }

  click_sub(){

    const wallet = this.walletForm.value
    const object = {
      ... wallet,
      user_id: this.userId,
      total_amount: this.walletForm.value.initial_amount
    }

    if (this.isEdit == true) {
      this.wallets.updateWallet(object, this.clickedWallet._id).subscribe(response =>{
        console.log(response)
        this.getTotalAvailable(this.clickedWallet._id)
      })
    } else {
      this.wallets.createWallet(object).subscribe(response =>{
        console.log(response);
      },(err) => {if (err.status === 500) {
        console.log(err)
      }});
    }

    this.walletForm.reset()
  }

  getClickedWallet(){
    this.sub = this.observable.wallet$.subscribe(info =>{
      this.clickedWallet = info
      this.isHide = true
      this.isEdit = true
      return this.clickedWallet    
    })   
  }

  updateValues(){
    this.isHide = false
    this.walletForm.patchValue({
      'name': this.clickedWallet.name,
      'initial_amount': this.clickedWallet.initial_amount,
      'type': this.clickedWallet.type
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  getTotalAvailable(walletId:string){
    this.wallets.getTotalAmount(walletId).subscribe(response =>{
      this.updateTotalAvailable(response.total_amount, walletId)
    })
  }

  updateTotalAvailable(amount:number,walletId:string){
    this.wallets.getOneWallet(walletId).subscribe((event:any) => {
      const totalavailable = event.initial_amount + amount
      this.wallets.updateWallet({total_amount: totalavailable}, walletId ).subscribe(response =>{
          // console.log(response)
      })
    }) 
  }

  deleteAllEvents(){
    this.router.navigate(['home']);
    
    this.wallets.deleteManyEvents(this.clickedWallet._id).subscribe(response =>{
      this.deleteWallet()
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
  }

  deleteWallet(){
    this.wallets.deleteWallet(this.clickedWallet._id).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
  }

}
