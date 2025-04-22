import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'decimal',
    standalone: false
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: any, prec: number = 2, zero = '-'): string {
    if ((zero && value === 0) || !value) {
      return zero;
    }
    if (!isNaN(value)){
      value = +value;
    }
    return value.toLocaleString('en-us', {minimumFractionDigits: prec ?? 2});
  }

  toFloat(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }
}
