import {DatePipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'localizedDate',
    pure: false,
    standalone: false
})
export class LocalizedDatePipe implements PipeTransform {

  transform(value: any, format = 'yyyy-MM-dd'): any {
    try {
      const datePipe = new DatePipe( 'en_US');
      return datePipe.transform(value, format);
    } catch (e) {
      return value;
    }
  }
}
