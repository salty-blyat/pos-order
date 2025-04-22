import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'customMinute',
    standalone: false
})
export class CustomMinutePipe implements PipeTransform{
  transform(value: any): string {
    let minute = parseInt(value);
    if (minute < 10){
      return "0" + minute + " m";
    }else {
      return minute + " m";
    }
  }

}
