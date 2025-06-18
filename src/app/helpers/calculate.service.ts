import { Injectable } from "@angular/core";
import Decimal from "decimal.js";

// Prevent scientific notation globally
Decimal.set({
  toExpNeg: -100, // show small numbers in full form (e.g., 1e-7 → 0.0000001)
  toExpPos: 100, // avoid exponential for large numbers
  precision: 20, // high precision for all operations
});

@Injectable({
  providedIn: "root",
})
export class CalculatorService {
  // Outputs exact string, with no rounding or exponential form
  private formatResult(result: Decimal): string {
    return result.toString();
  }

  add(a: number | string, b: number | string): string {
    return this.formatResult(new Decimal(a).plus(b));
  }

  subtract(a: number | string, b: number | string): string {
    return this.formatResult(new Decimal(a).minus(b));
  }

  multiply(a: number | string, b: number | string): string {
    return this.formatResult(new Decimal(a).times(b));
  }

  divide(a: number | string, b: number | string): string {
    const divisor = new Decimal(b);
    if (divisor.isZero()) {
      throw new Error("Division by zero");
    }
    return this.formatResult(new Decimal(a).dividedBy(divisor));
  }

  modulo(a: number | string, b: number | string): string {
    return this.formatResult(new Decimal(a).mod(b));
  }

  power(a: number | string, b: number | string): string {
    return this.formatResult(new Decimal(a).pow(b));
  }

  sqrt(a: number | string): string {
    const value = new Decimal(a);
    if (value.isNegative()) {
      throw new Error("Cannot take square root of negative number");
    }
    return this.formatResult(value.sqrt());
  }

  abs(a: number | string): string {
    return this.formatResult(new Decimal(a).abs());
  }

  negate(a: number | string): string {
    return this.formatResult(new Decimal(a).negated());
  }

  max(...args: (number | string)[]): string {
    const decimals = args.map((v) => new Decimal(v));
    return this.formatResult(Decimal.max(...decimals));
  }

  min(...args: (number | string)[]): string {
    const decimals = args.map((v) => new Decimal(v));
    return this.formatResult(Decimal.min(...decimals));
  }
}
