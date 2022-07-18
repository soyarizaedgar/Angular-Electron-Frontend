import { Component, OnDestroy, OnInit} from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';

import { ObservableService } from 'src/app/services/observable.service';
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

export class EventModalComponent implements OnInit, OnDestroy {

  walletsList:any = []
  userId:any = localStorage.getItem('user_id')
  
  paymentForm!: FormGroup;
  taskForm!: FormGroup;
  rruleForm!: FormGroup
  
  isPayment = true
  isFreq = false
  isAllDay = false
  isEdit = false
  isHide = false

  sub!: Subscription
  clickedEvent:any
  eventId:any  
  control = new FormControl('');
  filteredWallets!: Observable<Wallet[]>

  constructor(private wallets: WalletsService, private observable: ObservableService){

    this.getClickedEvent()
    
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
      'wallet_id': new FormControl(null,[Validators.required])
    });

    this.rruleForm = new FormGroup({
      'freq': new FormControl(null, [Validators.required]),
      'end': new FormControl('never', [Validators.required]),
      'count': new FormControl(null), 
      'until': new FormControl(null)
    });

    this.taskForm = new FormGroup({
      'title': new FormControl(null,  [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'date': new FormControl(null, [Validators.required]),
      'allDay': new FormControl(false, [Validators.required]),
      'start': new FormControl(null),
      'end': new FormControl(null),
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
          name: element.name,
          })});
    });
  }

  isPaymentToogle(value: boolean){
    this.isPayment = value
  }

  displayinfo(){
    this.isFreq = !this.rruleForm.value.freq
    this.isAllDay = !this.taskForm.value.allDay
    if (this.isFreq === false) {
      this.rruleForm.reset()
    }
    if (this.isAllDay === true) {
      this.taskForm.patchValue({
        'start': '00:00',
        'end': '23:59',
      })
    }
  }
// ****************************************************************

  resetRadioBtns(){
    this.rruleForm.patchValue({
      'until': null,
      'count': null,
    })
  }
  
  getTotalAvailable(walletId:string){
    this.wallets.getTotalAmount(walletId).subscribe(response =>{
      // let sum = 0
      // response.forEach((event:any) => {
      //   sum += event.amount
      // });
      this.updateTotalAvailable(response.total_amount, walletId)
    })
  }

  updateTotalAvailable(amount:number,walletId:string){
    this.wallets.getOneWallet(walletId).subscribe((event:any) => {
      const totalavailable = event.initial_amount + amount
      this.wallets.updateWallet({total_amount: totalavailable}, walletId ).subscribe(response =>{
          console.log(response)
      })
    }) 
  }

  updateEvent(object:object, eventId:string){
    this.wallets.updateEvent(object, eventId).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
  }

  createNewEvent(object:object){
    this.wallets.createEvent(object).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
  }


  click_pay(){
    
    if (this.isFreq === false) {
      this.rruleForm.value.count = 1
    }

    const rrule = {
      freq: 'monthly',
      dtstart: this.paymentForm.value.date,
      count: this.rruleForm.value.count || null,
      until: this.rruleForm.value.until || null
    }
    const payment = this.paymentForm.value
    const object = {
      ... payment,
      user_id: this.userId,
      amount: this.paymentForm.value.amount * -1,
      allDay:true,
      rrule
    }
    
    if (this.isEdit == true) {
      this.updateEvent(object, this.eventId)
    } else {
      this.createNewEvent(object)
    }

    this.getTotalAvailable(this.paymentForm.value.wallet_id)

    this.paymentForm.reset()
    this.rruleForm.reset()
    this.isFreq = false
  }
// **************************************************************************

  transformTime(time:string){
    
    const array:any = time.split(":")
    return array

  }

  click_task(){
    const task = this.taskForm.value
    const startTime = this.transformTime(task.start)
    const endTime = this.transformTime(task.end)
    
    const start = new Date(task.date + 'T00:00:00')
    start.setHours(startTime[0], startTime[1], 0);
 
    const end = new Date(task.date + 'T00:00:00')
    end.setHours(endTime[0], endTime[1], 0);

    const rrule = {
      freq: 'monthly',
      dtstart: start,
      count: 1,
      until: end,
    }

    const object:object = {
      rrule,
      ... task,
      user_id: this.userId,
    }

    if (this.isEdit == true) {
      this.updateEvent(object, this.eventId)
    } else {
      this.createNewEvent(object)
    }

    this.taskForm.reset()
  }

// ****************************************************************

  getClickedEvent(){
    this.sub = this.observable.event$.subscribe(info =>{
      this.clickedEvent = info
      if (this.clickedEvent.amount) {
        this.isPayment = true
      }else{
        this.isPayment = false
      }
      this.isHide = true
      this.isEdit = true
      return this.clickedEvent    
    })   
  }


  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  formatDate(utcdate:Date){
    const year = utcdate.getFullYear().toString()
    let month = (utcdate.getMonth() + 1).toString()
    if (month.length == 1) {
      month = month.padStart(2, '0')
    }
    let day = utcdate.getDate().toString()
    if (day.length == 1) {
      day = day.padStart(2, '0')
    }

    const date = year.concat('-',month,'-',day)
    return date
    
  }

  formatTime(utcdate:Date){
    let hour = utcdate.getHours().toString()
    if (hour.length == 1) {
      hour = hour.padStart(2, '0')
    }
    let minutes = utcdate.getMinutes().toString()
    if (minutes.length == 1) {
      minutes = minutes.padStart(2, '0')
    }
    const time = hour.concat(':', minutes)
    return time
  }

  updateValues(){
    this.isHide = false
    this.eventId = this.clickedEvent._id

    if (this.isPayment == true) {
      this.paymentForm.patchValue({
        'title': this.clickedEvent.title,
        'date':  this.formatDate(this.clickedEvent.date),
        'amount': this.clickedEvent.amount * -1,
        'wallet_id': this.clickedEvent.wallet_id
      })
      
      let freq = false, end = 'never', until

      if (this.clickedEvent.rrule.count > 1 || this.clickedEvent.rrule.until != null) {
       freq =  true
       this.displayinfo()
      }
      if (this.clickedEvent.rrule.count > 1) {
        end = 'after'
      }
      if (this.clickedEvent.rrule.until != null) {
        end = "on"
        until = this.formatDate(this.clickedEvent.rrule.until)
      } 

      this.rruleForm.patchValue({
        'dtstart': this.clickedEvent.rrule.dtstart,
        'count': this.clickedEvent.rrule.count,
        'until': until || this.clickedEvent.rrule.until,
        'freq': freq,
        'end': end
      })
    }
    else{

      if (this.clickedEvent.allDay == true) {
        this.displayinfo()
      }

      this.taskForm.patchValue({
        'title': this.clickedEvent.title,
        'allDay': this.clickedEvent.allDay,
        'date':  this.formatDate(this.clickedEvent.date),
        'start': this.formatTime(this.clickedEvent.rrule.dtstart),
        'end':  this.formatTime(this.clickedEvent.rrule.until)
      })
    }
    
  }

  // **************************************************************************

  deleteEvent(){
    
    this.wallets.deleteEvent(this.clickedEvent._id).subscribe(response =>{
      console.log(response);
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});

    this.getTotalAvailable(this.clickedEvent.wallet_id)

  }


  
}
