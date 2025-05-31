import { Pipe, PipeTransform } from "@angular/core";
import { AccountTypes } from "../../pages/lookup/lookup-type.service";

@Pipe({
  name: "accountBalance",
  standalone: false,
})
export class AccountBalancePipe implements PipeTransform {
  transform(balance: number | null | undefined, type: number): string {
    const safeBalance = Number(balance);
    if (isNaN(safeBalance)) {
      return type === AccountTypes.Wallet ? "$ 0.00" : "0 pts";
    }

    if (type === AccountTypes.Wallet) {
      // Format with 2 decimal places
      return `$ ${safeBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      // Format with no decimal places
      return `${Math.floor(safeBalance).toLocaleString("en-US")} pts`;
    }
  }
}