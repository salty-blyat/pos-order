import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculate.service";

describe("CalculatorService with Decimal.js", () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  const ensureFullForm = (result: string) => {
    // Assert it's not in scientific notation
    expect(result.includes("e")).toBeFalse();
  };

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Addition", () => {
    it("should add numbers accurately", () => {
      expect(service.add("0.1", "0.2")).toBe("0.3");
      expect(service.add("50.01", "0.01")).toBe("50.02");
      expect(service.add("0.0000001", "0.0000002")).toBe("0.0000003");
      expect(service.add("0.1", "0.7")).toBe("0.8");
      expect(service.add("-1.5", "2")).toBe("0.5");
      expect(service.add("1e-7", "2e-7")).toBe("0.0000003");
    });
  });

  describe("Subtraction", () => {
    it("should subtract numbers correctly", () => {
      expect(service.subtract("5.5", "2.2")).toBe("3.3");
      expect(service.subtract("0.3", "0.2")).toBe("0.1");
      expect(service.subtract("0.0000003", "0.0000002")).toBe("0.0000001");
      expect(service.subtract("2", "-2")).toBe("4");
    });

    it("should handle complex expressions", () => {
      expect(
        service.subtract(service.multiply("100002.11", "2"), "100000023.01")
      ).toBe("-99800018.79");
    });
  });

  describe("Multiplication", () => {
    it("should multiply numbers accurately", () => {
      expect(service.multiply("1.5", "2")).toBe("3");
      expect(service.multiply("1.1", "1.1")).toBe("1.21");
      expect(service.multiply("0.0002", "1000")).toBe("0.2");
      expect(service.multiply("-3", "-3")).toBe("9");
      expect(service.multiply("0.0000000000000001", "0.1")).toBe(
        "0.00000000000000001"
      );
    });
  });

  describe("Division", () => {
    it("should divide numbers correctly", () => {
      expect(service.divide("10", "4")).toBe("2.5");
      expect(service.divide("1", "3")).toBe("0.33333333333333333333");
      expect(service.divide("0.3", "0.1")).toBe("3");
      expect(service.divide("-6", "2")).toBe("-3");
    });

    it("should throw on divide by zero", () => {
      expect(() => service.divide("10", "0")).toThrowError("Division by zero");
    });
  });

  describe("Precision & scientific notation traps", () => {
    it("should output full-form decimals (no e)", () => {
      const values = [
        service.add("0.0000001", "0"),
        service.add("1e-7", "0"),
        service.subtract("0.0000003", "0.0000002"),
        service.multiply("0.0000000000000001", "0.1"),
        service.add("1.0000000000000001", "0.0000000000000001"),
        service.add("123456789.123456789", "0"),
      ];

      values.forEach((v) => ensureFullForm(v));
    });

    it("should handle large/small numbers", () => {
      expect(service.add("1e+10", "1")).toBe("10000000001");
      expect(service.multiply("1e-10", "1e-10")).toBe("0.00000000000000000001");
    });

    it("should not round unexpectedly", () => {
      expect(service.add("0.123456789123456789", "0")).toBe(
        "0.123456789123456789"
      );
    });
  });

  describe("Zero and edge cases", () => {
    it("should handle zeros correctly", () => {
      expect(service.add("0", "0")).toBe("0");
      expect(service.subtract("0", "0")).toBe("0");
      expect(service.multiply("0", "100")).toBe("0");
      expect(service.divide("0", "100")).toBe("0");
    });
  });

  describe("Stress test: realistic financial math", () => {
    it("should handle large precise calculations", () => {
      expect(
        service.subtract(
          service.multiply("123456.789", "987654.321"),
          "123456789"
        )
      ).toBe("121809174323.635269");
    });
  });
});
