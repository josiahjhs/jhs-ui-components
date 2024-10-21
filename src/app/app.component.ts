import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { getDefaultDateFilter } from './components/datepicker/datepicker.const';
import { DateFilter, DateTypeOptionEnum } from './components/datepicker/datepicker.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, DatepickerComponent, DatePipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jhs-ui-components';

  dateFilter: DateFilter = {
    start: null,
    end: null,
    type: DateTypeOptionEnum.DAY,
  };

  onFilterChanged(dateFilter: DateFilter) {
    this.dateFilter = dateFilter;
  }
}
