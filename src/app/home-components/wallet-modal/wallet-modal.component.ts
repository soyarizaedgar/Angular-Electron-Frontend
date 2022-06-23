import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

import { WalletsService } from 'src/app/services/wallets.service';

@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.scss']
})
export class WalletModalComponent implements OnInit {

  userId:any = localStorage.getItem('user_id');
  walletForm!: FormGroup;

  constructor(private wallets: WalletsService) { }

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
      user_id: this.userId
    }

    this.wallets.createWallet(object).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
    
  }

}
