import { Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Pipe({
  name: 'customTitleCase',
  standalone: true,
})
export class CustomTitleCasePipe implements PipeTransform {

  constructor() {}

  transform(value: any,): unknown {
    return this.toTitleCase(value);
  }

  toTitleCase(str: any) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
