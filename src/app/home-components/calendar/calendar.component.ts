import { Component, OnInit } from '@angular/core';

import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import esLocale from '@fullcalendar/core/locales/es';
import { Subscription } from 'rxjs';

import { WalletsService } from 'src/app/services/wallets.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  subscription!: Subscription;
  userId:any = localStorage.getItem('user_id');
  
  constructor(private wallets: WalletsService) { }

  ngOnInit(): void {
    this.getEvents()

    this.subscription = this.wallets.refresh$.subscribe(()=>{
      this.getEvents();
    })
  }

  
  getEvents(){
    this.wallets.getAllEvents(this.userId).subscribe(response =>{
      this.calendarOptions.events = response
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dayMaxEventRows: true,
    
    headerToolbar: {
      start: 'prev,next',
      center: 'title',
      end: 'today dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    eventColor: '#F26BAA',
    events: [],
    locales: [ esLocale],
    locale: 'es',// the initial locale. of not specified, uses the first one

  };





}
