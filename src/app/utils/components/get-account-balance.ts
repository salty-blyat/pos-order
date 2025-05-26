import { AccountTypes } from "../../pages/lookup/lookup-type.service";

export function getAccountBalance(
  type: AccountTypes,
  balance: number | null | undefined
): string {
  const safeBalance = balance != null ? balance : 0;

  const formattedBalance = safeBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (type == AccountTypes.Wallet) {
    return `$ ${formattedBalance}`;
  } else {
    return `${formattedBalance} pts`;
  }
}
