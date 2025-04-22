import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'customCurrency',
    standalone: false
})
export class CustomCurrencyPipe implements PipeTransform{
  transform(value: any): any {
    try {
      return new Intl.NumberFormat('en-us', {minimumFractionDigits: 2}).format(value);
    }catch (e) {
      return value;
    }
  }

}
