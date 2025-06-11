import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'peopleCount',
    standalone: false
})
export class PeopleCountPipe implements PipeTransform{
  transform(value: any): any {
   try {
     return value + " " + "people";
   }catch (e){
     return value;
   }

  }
}
