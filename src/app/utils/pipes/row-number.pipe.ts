import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rowNumber',
    standalone: false
})
export class RowNumberPipe implements PipeTransform {

  transform(value: number, arg: {index: number, size: number}): number {
    if (arg.index === 1) {
      return value + 1;
    }
    return ((arg.size * (arg.index - 1)) + value) + 1;
  }

}
