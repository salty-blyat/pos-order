import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
    name: 'customHour',
    standalone: false
})
export class CustomHourPipe implements PipeTransform{
  transform(value: any): string {
    let hour = parseFloat(value);
    if (hour==0){
      return "0.00 h";
    }else {
      return hour.toFixed(2) + " h"
    }
  }

}
