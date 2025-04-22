import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'customDate',
    standalone: false
})
export class CustomDatePipe implements PipeTransform{
  transform(value: any, format: string = 'yyyy-MM-dd', ...args: unknown[]): unknown {
    return !value ? '-' : new DatePipe('en-US').transform(value, format);
  }
}
