import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toJson',
    standalone: false
})
export class ToJsonPipePipe implements PipeTransform {
  transform(value: any): any {
    try {
      return JSON.parse(value)?.url;
    } catch (e) {
      return value;
    }
  }
}
