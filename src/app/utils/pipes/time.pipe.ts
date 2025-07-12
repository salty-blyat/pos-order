import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'time',
    standalone: false
})
@Injectable({ providedIn: 'root' })
export class  TimePipe implements PipeTransform{
  transform(value: any, format: string = 'h:mm a', ...args: unknown[]): unknown {
    return !value ? '-' : new DatePipe('en-US').transform(value, format);
  }
}
