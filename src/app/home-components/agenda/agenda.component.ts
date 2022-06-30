import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CalendarOptions} from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/observable.service';
import { WalletsService } from 'src/app/services/wallets.service';
// import { EventEditComponent } from '../event-edit/event-edit.component';
import { EventModalComponent } from '../event-modal/modal.component';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  subscription!: Subscription;
  userId:any = localStorage.getItem('user_id');

  constructor(private wallets: WalletsService,public modal: MatDialog, private observable: ObservableService) { }

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
    
    initialView: 'listWeek',
    dayMaxEventRows: true,
    
    headerToolbar: {
      start: 'prev,next',
      center: 'title',
      end: 'today'
    },

    editable: true,
    eventColor: '#378006',

    locales: [ esLocale],
    locale: 'es', 
    selectable: true,
    eventClick: this.handleDateClick.bind(this),
    events: []

  };

  handleDateClick(info:any){
    const rrule_ = info.event._def.recurringDef.typeData.rruleSet._rrule[0].options

    const rrule = {
      freq: 'monthly',
      dtstart: rrule_.dtstart,
      count: rrule_.count,
      until: rrule_.until 
    }
    const allDay = info.event.allDay
    const date = info.event._instance.range.end
    const title = info.event._def.title
    const eventinfo = info.event._def.extendedProps
    const object = {
      ...eventinfo,
      title,
      date,
      allDay,
      rrule
    }
    this.modal.open(EventModalComponent);
    this.observable.event$.emit(object)
  }

}


