export interface DateFilter {
  start: any;
  end: any;
  type: DateRangePresetOption;
}

export class DateRangePresetOptionEnum {
  static readonly DAY = 'day';
  static readonly MONTH = 'month';
  static readonly YEAR = 'year';
}

export class DateTypeOptionEnum {
  static readonly DAY = 'day';
  static readonly MONTH = 'month';
  static readonly YEAR = 'year';
}

export type DateTypeOption = typeof DateTypeOptionEnum[keyof typeof DateTypeOptionEnum];

export type DateRangePresetOption = typeof DateRangePresetOptionEnum[keyof typeof DateRangePresetOptionEnum];
