import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObservableService } from 'src/app/services/observable.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  option = 1
  constructor() { }

  ngOnInit(): void {
  }

  returnOption(num:number){
    this.option = num
  }

}
