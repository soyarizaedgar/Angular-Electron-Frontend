import { Component, OnInit } from '@angular/core';
import { WalletsService } from 'src/app/services/wallets.service';

// MODAL
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {EventModalComponent} from '../event-modal/modal.component';
import { WalletModalComponent } from '../wallet-modal/wallet-modal.component';
import { ObservableService } from 'src/app/services/observable.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  walletsList: any;
  userId:any = localStorage.getItem('user_id');
  todaysDate:Date = new Date();
  month = this.todaysDate.getMonth()

  subscription!: Subscription;

  constructor(private wallets: WalletsService, public modal: MatDialog, private observable: ObservableService) { }
  
  ngOnInit(): void {
    this.getWallets()

    this.subscription = this.wallets.refresh$.subscribe(()=>{
      this.getWallets();
    })
  }

  getWallets(){
    this.wallets.getAllWallets(this.userId).subscribe(response =>{
      this.walletsList = response;
    });
  }

  getWalletId(walletId:string){
    localStorage.setItem('wallet_id', walletId);
  }

  openModal(letter: string){
    switch (letter) {
      case 'W':
        this.modal.open(WalletModalComponent);
        break;
      case 'E':
        this.modal.open(EventModalComponent);
        break;
    }
  }

}
