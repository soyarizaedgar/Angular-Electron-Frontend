import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HomeComponentsRoutingModule } from './home-components-routing.module';
import { MainComponent } from './main/main.component';
import { EventModalComponent } from './event-modal/modal.component';
import { WalletModalComponent } from './wallet-modal/wallet-modal.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CalendarComponent } from './calendar/calendar.component';
import { NavigationComponent } from './navigation/navigation.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins

// plugins
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AgendaComponent } from './agenda/agenda.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin
]);

@NgModule({
  declarations: [
    MainComponent,
    EventModalComponent,
    WalletModalComponent,
    CalendarComponent,
    NavigationComponent,
    AgendaComponent
  ],
  imports: [
    CommonModule,
    HomeComponentsRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FullCalendarModule
  ],
  exports:[
    NavigationComponent,
    MainComponent,
    CalendarComponent
  ]
})
export class HomeComponentsModule { }
