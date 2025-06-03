import { Pipe, PipeTransform } from "@angular/core";
import { AccountTypes } from "../../pages/lookup/lookup-type.service";
import format from "number-format.js";
import { Currency } from "../../pages/currency/currency.service";
import { SharedVar } from "../services/logic-helper.service";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../../pages/system-setting/system-setting.service";
import { LocalStorageService } from "../services/localStorage.service";

@Pipe({
  name: "accountBalance",
  standalone: false,
})
export class AccountBalancePipe implements PipeTransform {
  constructor(
    private currencySettingService: SystemSettingService,
    private localStorageService: LocalStorageService
  ) {}
  transform(balance: number | null | undefined, type: number): any {
    const safeBalance = Number(balance);
    if (isNaN(safeBalance)) {
      return type === AccountTypes.Wallet ? "$ 0.00" : "0 pts";
    }
    let currency: Currency[] = this.localStorageService.getValue(
      SharedVar.CURRENCIES
    );

    if (type === AccountTypes.Point) {
      return format("#,##0.##", safeBalance) + " pts";
    } else {
      try {
        return `${
          currency.find(
            (x) =>
              x.id ==
              this.currencySettingService.current.items.find(
                (item) => item.key === SETTING_KEY.MainCurrency
              )?.value
          )?.symbol ?? ""
        }
        ${format(
          currency.find(
            (x) =>
              x.id ==
              this.currencySettingService.current.items.find(
                (item) => item.key === SETTING_KEY.MainCurrency
              )?.value
          )?.format ?? "#",
          safeBalance
        )}`.trim();
      } catch (e) {
        return safeBalance;
      }
    }
  }
}
