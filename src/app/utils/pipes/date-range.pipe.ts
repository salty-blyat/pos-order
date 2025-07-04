import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CustomDateTimePipe } from "./custom-date-time.pipe";

@Pipe({
  name: "dateRange",
  standalone: false,
})
export class DateRangePipe implements PipeTransform {
  constructor(private datePipe: CustomDateTimePipe) {}

  transform(
    startDate: string | null,
    endDate: string | null,
    lang: string
  ): string {
    if (startDate && !endDate) {
      return `${
        lang == "km" ? "ចាប់ពី" : lang == "en" ? "From" : "从"
      } ${this.datePipe.transform(startDate)}`;
    } else if (!startDate && endDate) {
      return `${
        lang == "km" ? "រហូតដល់" : lang == "en" ? "Until" : "直到"
      } ${this.datePipe.transform(endDate)}`;
    } else if (!startDate && !endDate) {
      return lang == "km" ? "ឥតកំណត់" : lang == "en" ? "Unlimited" : "无限";
    } else {
      const from = this.datePipe.transform(startDate);
      const to = this.datePipe.transform(endDate);
      return `${from} ~ ${to}`;
    }
  }
}
