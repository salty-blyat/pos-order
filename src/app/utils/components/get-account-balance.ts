import { AccountTypes } from "../../pages/lookup/lookup-type.service";

export function getAccountBalance(
  type: number,
  balance: number | null | undefined
): string {
  const safeBalance = Number(balance); // or your actual balance input
  const formattedBalance = isNaN(safeBalance)
    ? "0.00"
    : safeBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  if (type == AccountTypes.Wallet) {
    return `$ ${formattedBalance}`;
  } else {
    return `${formattedBalance} pts`;
  }
}
