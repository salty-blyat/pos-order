import { Pipe, PipeTransform } from "@angular/core";
import format from "number-format.js";

@Pipe({
  name: "formatTwoDigit",
  standalone: false,
})
export class FormatTwoDigitPipe implements PipeTransform {
  constructor() {}
  transform(balance: number | null): any {
    const safeBalance = Number(balance);
    return format("#,##0.##", safeBalance);
  }
}
