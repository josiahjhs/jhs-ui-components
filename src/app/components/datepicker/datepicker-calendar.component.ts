import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DateTypeOption, DateTypeOptionEnum } from './datepicker.interface';

@Component({
  selector: 'jhs-datepicker-calendar',
  templateUrl: './datepicker-calendar.component.html',
  styleUrls: [ './datepicker-calendar.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
  ]
})
export class DatepickerCalendarComponent implements OnChanges {

  @ViewChildren('dayButton') dayButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('monthButton') monthButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('yearButton') yearButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  @Input() label = 'Start';
  @Input() date = new Date();

  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;

  @Output() onSelectedDate = new EventEmitter<Date>();

  showedDate = new Date();

  @Input() calendarType: string = 'day';


  yearList: number[] = [];
  dateRange: any[] = [];

  monthList: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
  monthRange: any[] = [];

  yearlyList: any[] = [];
  yearRange: any[] = [];
  selectedYearIndex = 0;

  constructor() {
    this.yearlyList = [];
    const yearEnd = new Date().getFullYear() + 4;
    const yearStart = yearEnd - 35;
    for (let i = yearStart; i <= yearEnd; i += 9) {
      const item = [ i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8 ];
      this.yearlyList.push(item);
    }
  }

  ngOnChanges() {
    this.showedDate = this.date;
    switch (this.calendarType) {
      case 'day':
        this.generateDate();
        break;
      case 'month':
        this.generateYearList();
        this.generateMonth();
        break;
      case 'year':
        const currentYear = this.date.getFullYear();
        this.yearlyList.forEach((e, index) => {
          const i = e.findIndex((y: any) => y === currentYear);
          if (i !== -1) {
            this.selectedYearIndex = index;
          }
        })
        this.generateYear();
        break;
    }
  }

  changeMonth(month: number) {
    this.showedDate.setMonth(month);
    this.generateDate();
  }

  changeYear(year: number) {
    this.showedDate.setFullYear(year);
    this.generateDate();
  }

  generateDate() {
    if (!this.showedDate) {
      return;
    }
    this.dateRange = [];
    let year = this.showedDate.getFullYear();
    let month = this.showedDate.getMonth();

    let dayOne = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let dayEnd = new Date(year, month, lastDate).getDay();
    let monthLastDate = new Date(year, month, 0).getDate();

    for (let i = dayOne; i > 0; i--) {
      this.dateRange.push({
        value: monthLastDate - i + 1,
        status: 'disabled'
      });
    }

    for (let i = 1; i <= lastDate; i++) {
      let isToday = i === this.date.getDate() && month === this.date.getMonth() && year === this.date.getFullYear();
      const date = moment(this.showedDate).set('date', i);
      if (isToday) {
        this.dateRange.push({
          value: i,
          status: 'active'
        });
      } else if (this.startDate && moment(date).isBefore(this.startDate)) {
        this.dateRange.push({
          value: i,
          status: 'disabled'
        });
      } else if (this.endDate && moment(date).isAfter(this.endDate)) {
        this.dateRange.push({
          value: i,
          status: 'disabled'
        });
      } else if (this.startDate && moment(date).isSameOrAfter(this.startDate) && moment(date).isSameOrBefore(this.date)) {
        this.dateRange.push({
          value: i,
          status: 'in-range'
        });
      } else if (this.endDate && moment(date).isSameOrAfter(this.date) && moment(date).isSameOrBefore(this.endDate)) {
        this.dateRange.push({
          value: i,
          status: 'in-range'
        });
      } else {
        this.dateRange.push({
          value: i,
          status: ''
        });
      }
    }

    for (let i = dayEnd; i < 6; i++) {
      this.dateRange.push({
        value: i - dayEnd + 1,
        status: 'disabled'
      });
    }
    this.generateYearList();
  }

  generateYearList() {
    this.yearList = [];
    const year = this.date.getFullYear();
    for (let i = 1; i <= 6; i++) {
      this.yearList.push(year + 6 - i);
    }
    this.yearList.push(year);
    for (let i = 1; i <= 6; i++) {
      this.yearList.push(year - i);
    }
  }

  nextMonth() {
    this.showedDate = moment(this.showedDate).add(1, 'month').toDate();
    this.generateDate();
  }

  prevMonth() {
    this.showedDate = moment(this.showedDate).subtract(1, 'month').toDate();
    this.generateDate();
  }

  selectDate(index: number) {
    if (this.dateRange[index].status === 'disabled') {
      return;
    }

    const value = this.dateRange[index].value;

    const selectedDate = new Date(this.showedDate);
    selectedDate.setDate(value);
    this.dayButtons.toArray()[index].nativeElement.focus();
    this.generateDate();
    this.onSelectedDate.emit(selectedDate);
  }


  nextYear() {
    this.showedDate = moment(this.showedDate).add(1, 'year').toDate();
    this.generateMonth();
  }

  prevYear() {
    this.showedDate = moment(this.showedDate).subtract(1, 'year').toDate();
    this.generateMonth();
  }

  selectMonth(index: number) {
    let selectedDate = moment({
      day: 1,
      month: index,
      year: this.showedDate.getFullYear()
    }).toDate();

    if (this.startDate && moment(selectedDate).isBefore(this.startDate)) {
      return;
    } else if (this.endDate && moment(selectedDate).isAfter(this.endDate)) {
      return;
    }

    if (this.startDate) {
      selectedDate = moment(selectedDate).add('month', 1).subtract('day', 1).toDate();
      selectedDate.setMinutes(59);
      selectedDate.setHours(23);
    }

    if (this.endDate) {
      selectedDate.setMinutes(0);
      selectedDate.setHours(0);
    }

    this.generateMonth();
    this.onSelectedDate.emit(selectedDate);
  }

  generateMonth() {
    this.monthRange = [];

    this.monthList.forEach((m, index) => {
      const date = new Date(this.showedDate);
      date.setMonth(index);

      let status = '';
      if (this.endDate) {
        if (moment(date).isAfter(this.endDate)) {
          status = 'disabled';
        }

        if (moment(date).isSameOrAfter(this.date) && moment(date).isSameOrBefore(this.endDate)) {
          status = 'in-range';
        }
      }
      if (this.startDate) {
        if (moment(date).isBefore(this.startDate)) {
          status = 'disabled';
        }

        if (moment(date).isSameOrAfter(this.startDate) && moment(date).isSameOrBefore(this.date)) {
          status = 'in-range';
        }
      }

      this.monthRange.push({
        value: m,
        status
      });
    });
  }

  changeYearMonthly(year: number) {
    this.showedDate.setFullYear(year);
    this.generateMonth();
  }

  generateYear() {
    this.yearRange = [];

    this.yearlyList[this.selectedYearIndex].forEach((y: any) => {
      const date = new Date();
      date.setFullYear(y);

      let status = '';
      if (this.endDate) {
        if (moment(date).isAfter(this.endDate)) {
          status = 'disabled';
        }

        if (moment(date).isSameOrAfter(this.date) && moment(date).isSameOrBefore(this.endDate)) {
          status = 'in-range';
        }
      }
      if (this.startDate) {
        if (moment(date).isBefore(this.startDate)) {
          status = 'disabled';
        }

        if (moment(date).isSameOrAfter(this.startDate) && moment(date).isSameOrBefore(this.date)) {
          status = 'in-range';
        }
      }

      this.yearRange.push({
        value: y,
        status
      });
    });
  }

  nextYearYearly() {
    this.selectedYearIndex++;
    this.generateYear();
  }

  prevYearYearly() {
    this.selectedYearIndex--;
    this.generateYear();
  }

  changeYearYearly(index: number) {
    this.selectedYearIndex = index;
    this.generateYear();
  }

  selectYear(year: number) {
    let selectedDate = moment({
      day: 1,
      month: 0,
      year
    }).toDate();

    if (this.startDate && moment(selectedDate).isBefore(this.startDate)) {
      return;
    } else if (this.endDate && moment(selectedDate).isAfter(this.endDate)) {
      return;
    }

    if (this.startDate) {
      selectedDate = moment(selectedDate).add('year', 1).subtract('day', 1).toDate();
      selectedDate.setMinutes(59);
      selectedDate.setHours(23);
    }

    if (this.endDate) {
      selectedDate.setMinutes(0);
      selectedDate.setHours(0);
    }

    this.generateYear();
    this.onSelectedDate.emit(selectedDate);
  }

  onKeyDown(event: KeyboardEvent, index: number, type: DateTypeOption) {
    let buttonsArray = this.getButtons(type).toArray();
    const multiplier = this.getMultiplier(type);
    const next = this.getNext(type);
    const prev = this.getPrev(type);

    if (event.key === 'ArrowRight') {
      let nextIndex = (index + 1);
      if (nextIndex > buttonsArray.length) {
        next();
        nextIndex = nextIndex - buttonsArray.length;
      }
      buttonsArray[nextIndex].nativeElement.focus();

    } else if (event.key === 'ArrowLeft') {
      let nextIndex = (index - 1);
      if (nextIndex < 0) {
        prev();
        nextIndex = buttonsArray.length + nextIndex;
      }
      buttonsArray[nextIndex].nativeElement.focus();

    } else if (event.key === 'ArrowUp') {
      let nextIndex = (index - multiplier);
      if (nextIndex < 0) {
        prev();
        nextIndex = buttonsArray.length + nextIndex;
      }
      buttonsArray[nextIndex].nativeElement.focus();

    } else if (event.key === 'ArrowDown') {
      let nextIndex = (index + multiplier);
      if (nextIndex > buttonsArray.length) {
        next();
        nextIndex = nextIndex - buttonsArray.length;
      }
      buttonsArray[nextIndex].nativeElement.focus();

    }
  }

  getMultiplier(type: DateTypeOption) {
    switch (type) {
      case DateTypeOptionEnum.YEAR:
        return 3;
      case DateTypeOptionEnum.MONTH:
        return 3;
      case DateTypeOptionEnum.DAY:
        return 7;
    }
    return 7;
  }

  getButtons(type: DateTypeOption) {
    switch (type) {
      case DateTypeOptionEnum.YEAR:
        return this.yearButtons;
      case DateTypeOptionEnum.MONTH:
        return this.monthButtons;
      case DateTypeOptionEnum.DAY:
        return this.dayButtons;
    }
    return this.dayButtons;
  }

  getNext(type: DateTypeOption) {
    switch (type) {
      case DateTypeOptionEnum.YEAR:
        return this.nextYearYearly.bind(this);
      case DateTypeOptionEnum.MONTH:
        return this.nextYear.bind(this);
      case DateTypeOptionEnum.DAY:
        return this.nextMonth.bind(this);
    }
    return this.nextMonth.bind(this);
  }

  getPrev(type: DateTypeOption) {
    switch (type) {
      case DateTypeOptionEnum.YEAR:
        return this.prevYearYearly.bind(this);
      case DateTypeOptionEnum.MONTH:
        return this.prevYear.bind(this);
      case DateTypeOptionEnum.DAY:
        return this.prevMonth.bind(this);
    }
    return this.prevMonth.bind(this);
  }

  protected readonly DateTypeOptionEnum = DateTypeOptionEnum;
}
