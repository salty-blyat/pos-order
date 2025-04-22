import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
    name: 'attendanceRated',
    standalone: false
})

export class AttendanceRatedPipe implements PipeTransform{

  transform(value: any, ...args: any[]): any {
    let rated = parseFloat(value);
    if (rated < 1){
      if (rated == 0){
        return rated + ".0";
      }
      return rated;
    }else {
      return rated.toFixed(1);
    }
  }

}
