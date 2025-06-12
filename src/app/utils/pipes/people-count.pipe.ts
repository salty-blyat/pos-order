import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "peopleCount",
  standalone: false,
})
export class PeopleCountPipe implements PipeTransform {
  transform(value: any, lang: string): any {
    if (value === null || value === undefined) {
      return "0 People"; 
    }

    const safeNumber = Number(value); 

    if (isNaN(safeNumber) || !safeNumber) {
      return value + " " + "People";
    }

    try {
      if (lang == "km") {
        return value + " " + "នាក់";
      } else {
        return value + " " + "People";
      }
    } catch (e) {
      return value;
    }
  }
}
