import {Injectable} from '@angular/core';
import endOfMonth from 'date-fns/endOfMonth';
import {last} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {
  }

  public getRanges() {
    const today = new Date();
    const rng = {
      Today: [today, today],
      'This week': this.getWeekRange(today),
      'This month': this.getMonthRange(today),
      'This year': this.getYearRange(today),
    };
    return rng;
  }

  public getListRanges(startDate?: Date): { key: string; val: [Date, Date] }[] {
    const today = new Date();
    return [
      //{key: 'month_to_date',val: this.getMonthToDate(today)},
      {key: 'Today', val: [today, today]},
      {key: 'ThisWeek', val: this.getWeekRange(today)},
      {key: 'ThisMonth', val: this.getMonthRange(today)},
      {key: 'ThisYear', val: this.getYearRange(today)},
      {key: 'NextSixMonths', val: this.getNextSixMonthsRange(startDate ?? today)},
      {key: 'NextYear', val: this.getNextYearRange(startDate ?? today)},
      {key: 'NextTwoYears', val: this.getNextTwoYearRange(startDate ?? today)},
      {key: 'NextThreeYears', val: this.getNextThreeYearRange(startDate ?? today)},
    ];
  }

  public getWeekRange(today: Date): [Date, Date] {
    const d = new Date(today); // clone before change
    const first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    return [new Date(d.setDate(first)), new Date(d.setDate(last))];
  }

  public getBiWeekRange(today: Date): [Date, Date] {
    const d = new Date(today);
    const first = today.getDate() - today.getDay()
    const last = first + 13;
    return [new Date(d.setDate(first)),new Date(d.setDate(last))];
  }

  public getMonthToDate(today: Date): [Date, Date]{
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), 1);
    const d2 = new Date();
    return [d1, d2];
  }

  public getMonthRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), 1);
    const d2 = endOfMonth(new Date());
    return [d1, d2];
  }

  public getYearRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), 0, 1);
    const d2 = new Date(today.getFullYear(), 11, 31);
    return [d1, d2];
  }
  public getFirstDayOfYear(today: Date): Date
  {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), 0, 1);
    return d1;
  }


  public getNextSixMonthsRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth()+6, today.getDate());
    return [d1, d2];
  }
  public getNextYearRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(today.getFullYear()+1, today.getMonth(), today.getDate());
    return [d1, d2];
  }
  public getNextTwoYearRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(today.getFullYear()+2, today.getMonth(), today.getDate());
    return [d1, d2];
  }
  public getNextThreeYearRange(today: Date): [Date, Date] {
    today = new Date(today);
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(today.getFullYear()+3, today.getMonth(), today.getDate());
    return [d1, d2];
  }
}
