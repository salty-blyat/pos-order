import { Pipe, PipeTransform } from "@angular/core";
import { AccountTypes } from "../../pages/lookup/lookup-type.service";

@Pipe({
  name: "accountBalance",
  standalone: false,
})
export class AccountBalancePipe implements PipeTransform {
  transform(balance: number | null | undefined, type: number): string {
    const safeBalance = Number(balance);
    const formattedBalance = isNaN(safeBalance)
      ? "0.00"
      : safeBalance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

    if (type === AccountTypes.Wallet) {
      return `$ ${formattedBalance}`;
    } else {
      return `${formattedBalance} pts`;
    }
  }
}
