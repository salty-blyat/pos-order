import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'localizedDateTime',
    standalone: false
})
export class LocalizedDateTimePipe implements PipeTransform{
  transform(value: any, format = 'yyyy-MM-dd HH:mm:ss a'): any {
   try {
     return new DatePipe('en_US').transform(value, format);
   }catch (e){
     return value;
   }

  }
}
