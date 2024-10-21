import {
  DateFilter,
  DateRangePresetOption,
  DateRangePresetOptionEnum,
  DateTypeOption,
  DateTypeOptionEnum
} from './datepicker.interface';

export function getDefaultDateFilter(type: DateRangePresetOption = DateRangePresetOptionEnum.DAY): DateFilter {
  return {
    start: null,
    end: null,
    type: type,
  };
}

export const DateTypeOptionValues: DateTypeOption[] = [
  DateTypeOptionEnum.DAY,
  DateTypeOptionEnum.MONTH,
  DateTypeOptionEnum.YEAR,
];

export const DateRangePresetOptionValues: DateRangePresetOption[] = [
  DateRangePresetOptionEnum.DAY,
  DateRangePresetOptionEnum.MONTH,
  DateRangePresetOptionEnum.YEAR,
];
