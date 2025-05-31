import { isStandalone, Pipe, PipeTransform } from "@angular/core";
import { TransactionTypes } from "../../pages/lookup/lookup-type.service";

@Pipe({
  name: "transactionTypeName",
  standalone: false,
})
export class TransactionTypePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case TransactionTypes.Adjust:
        return "Adjust";
      case TransactionTypes.Topup:
        return "Topup";
      case TransactionTypes.Order:
        return "Order";
      case TransactionTypes.Earn:
        return "Earn";
      case TransactionTypes.Redeem:
        return "Redeem";
      default:
        return "";
    }
  }
}
