import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CustomDateTimePipe } from "./custom-date-time.pipe";

@Pipe({
  name: "dateRange",
  standalone: false
})
export class DateRangePipe implements PipeTransform {
  constructor(
    private datePipe: CustomDateTimePipe, 
  ) {}

  transform(startDate: string | null, endDate: string | null, lang:string): string { 
    if (startDate && !endDate) {
      return `${lang == 'km' ? "ចាប់ពី" : "From"} ${this.datePipe.transform(startDate)}`;
    } else if (!startDate && endDate) {
      return `${lang == 'km' ? "រហូតដល់" : "Until"} ${this.datePipe.transform(endDate)}`;
    } else if (!startDate && !endDate) {
      return  lang == 'km' ? "ឥតកំណត់" : "Unlimited";
    } else {
      const from = this.datePipe.transform(startDate);
      const to = this.datePipe.transform(endDate);
      return `${from} ~ ${to}`;
    }
  }
}
