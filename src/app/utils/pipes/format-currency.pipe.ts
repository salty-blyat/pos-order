import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../services/localStorage.service';
import { SharedVar } from '../services/logic-helper.service';
// @ts-ignore
import format from 'number-format.js';
import {SETTING_KEY, SystemSettingService} from "../../pages/system-setting/system-setting.service";
import {Currency} from "../../pages/currency/currency.service";

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  constructor(
    private currencySettingService: SystemSettingService,
    private localStorageService: LocalStorageService
  ) {}

  transform(
    value: any,
    isSymbol: boolean = true,
    id?: number,
    preferZero = false
  ): any {
    let currency: Currency[] = this.localStorageService.getValue(
      SharedVar.CURRENCIES
    );
    if (value === 0 && !preferZero) {
      return '-';
    }
    if (value === 0 && preferZero) return value;

    if (!currency) {
      return value;
    }
    try {
      return `${
        isSymbol
          ? currency.find(
              (x) =>
                x.id ==
                (id ??
                  this.currencySettingService.current.items.find(
                    (item) => item.key === SETTING_KEY.MainCurrency
                  )?.value)
            )?.symbol ?? ''
          : ''
      }
 ${format(
   currency.find(
     (x) =>
       x.id ==
       (id ??
         this.currencySettingService.current.items.find(
           (item) => item.key === SETTING_KEY.MainCurrency
         )?.value)
   )?.format ?? '#',
   value
 )}`.trim();
    } catch (e) {
      return value;
    }
  }
}
