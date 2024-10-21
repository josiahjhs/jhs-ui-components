import { Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { DatepickerCalendarComponent } from './datepicker-calendar.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { DateFilter, DateRangePresetOptionEnum, DateTypeOption } from './datepicker.interface';
import { DateTypeOptionValues, getDefaultDateFilter } from './datepicker.const';
import { CustomTitleCasePipe } from './custom-title-case.pipe';

@Component({
  selector: 'jhs-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: [ './datepicker.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    DatepickerCalendarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    CustomTitleCasePipe,
  ]
})
export class DatepickerComponent implements OnInit {
  readonly dateTypeOptions: DateTypeOption[] = DateTypeOptionValues;

  @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;
  @ViewChild('btn') private btn!: ElementRef;
  @Input() dateFilter: DateFilter | null = null;
  @Output() dateChanged: EventEmitter<DateFilter> = new EventEmitter<DateFilter>();

  formGroup: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    startTime: new FormControl(),
    endTime: new FormControl(),
    startDate: new FormControl({ value: null, disabled: true }),
    endDate: new FormControl({ value: null, disabled: true }),
    type: new FormControl(DateRangePresetOptionEnum.DAY),
  });
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, ) {
  }

  ngOnInit() {
    if (!this.dateFilter) {
      const todayDateFilter = getDefaultDateFilter();
      this.initTemp(todayDateFilter);
    } else {
      if (!this.dateFilter.start) {
        this.dateFilter.start = new Date();
      }
      if (!this.dateFilter.end) {
        this.dateFilter.end = new Date();
      }
      this.initTemp(this.dateFilter);
    }
  }


  initTemp(dateFilter: DateFilter) {
    const start = dateFilter.start;
    const end = dateFilter.end;
    this.formGroup.patchValue({
      start: dateFilter.start,
      end: dateFilter.end,
      startTime: moment(start).format('HH:mm'),
      endTime: moment(end).format('HH:mm'),
      startDate: moment(start).format('DD/MM/YYYY'),
      endDate: moment(end).format('DD/MM/YYYY'),
      type: dateFilter?.type || 'day'
    })
  }

  openDatepicker() {
    if (this.overlayRef) {
      this.hide();
      return;
    }
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.contentTemplate);
    this.overlayRef.backdropClick().subscribe(() => this.hide());
  }

  selectType(type: DateTypeOption) {
    this.formGroup.get('type')?.setValue(type);
  }

  shortcutToday() {
    if (!this.isDay()) {
      return;
    }

    const todayDateFilter = {
      start: moment(new Date()).set('hour', 0).set('minute', 0).set('second', 0).toDate(),
      end: new Date(),
      type: DateRangePresetOptionEnum.DAY,
    };
    this.initTemp(todayDateFilter);
  }

  shortcutLast30Days() {
    if (!this.isDay()) {
      return;
    }

    const now = moment(new Date()).set('h', 0).set('minute', 0).set('second', 0).toDate();
    const dateFilter: DateFilter = {
      start: moment(now).subtract(30, 'day').toDate(),
      end: moment(now).set('h', 23).set('minute', 59).set('second', 59).toDate(),
      type: DateRangePresetOptionEnum.DAY,
    };
    this.initTemp(dateFilter);
  }

  shortcutLast90Days() {
    if (!this.isDay()) {
      return;
    }

    const now = moment(new Date()).set('h', 0).set('minute', 0).set('second', 0).toDate();
    const dateFilter: DateFilter = {
      start: moment(now).subtract(90, 'day').toDate(),
      end: moment(now).set('h', 23).set('minute', 59).set('second', 59).toDate(),
      type: DateRangePresetOptionEnum.DAY,
    };
    this.initTemp(dateFilter);
  }

  shortcutLastYear() {
    if (!this.isDay()) {
      return;
    }

    const now = moment(new Date()).set('h', 0).set('minute', 0).set('second', 0).toDate();
    const dateFilter: DateFilter = {
      start: moment(now).subtract(365, 'day').toDate(),
      end: moment(now).set('h', 23).set('minute', 59).set('second', 59).toDate(),
      type: DateRangePresetOptionEnum.DAY,
    };
    this.initTemp(dateFilter);
  }

  onSelectedDate(formControlName: string, value: Date) {
    this.formGroup.get(formControlName)?.setValue(moment(value).toDate());
    this.formGroup.get(formControlName + 'Date')?.setValue(moment(value).format('DD/MM/YYYY'));
    this.formGroup.get(formControlName + 'Time')?.setValue(moment(value).format('HH:mm'));
  }

  apply() {
    const formValue = this.formGroup.getRawValue();
    const dateFilter: DateFilter = {
      start: moment(formValue.startDate + ' ' + formValue.startTime, 'DD/MM/YYYY hh:mm').toDate(),
      end: moment(formValue.endDate + ' ' + formValue.endTime, 'DD/MM/YYYY hh:mm').toDate(),
      type: formValue.type,
    };
    this.dateChanged.emit(dateFilter);
    this.hide();
  }

  cancel() {
    this.hide();
  }

  isDay() {
    return this.formGroup.get('type')?.value === DateRangePresetOptionEnum.DAY;
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.btn.nativeElement)
      .withPush(true)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  private hide(): void {
    this.overlayRef?.detach();
    this.overlayRef = null;
  }
}
