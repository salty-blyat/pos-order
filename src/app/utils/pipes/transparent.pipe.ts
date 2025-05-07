import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "transparent",
  standalone: false,
})
export class TransparentPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) return "";
    const hex = value.trim();
    if ( /^#([A-Fa-f0-9]{8})$/.test(hex) &&  hex.slice(-2).toLowerCase() === "00" ) {
      return "";
    } else {
      return value;
    }
  }
}
