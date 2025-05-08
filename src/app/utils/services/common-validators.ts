import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NzSafeAny } from "ng-zorro-antd/core/types";
// @ts-ignore
import { Observable, Observer } from "rxjs";

export type MyErrorsOptions = { km: string; en: string } & Record<
  string,
  NzSafeAny
>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;
export enum control {
  name = "name",
  nameEn = "nameEn",
}
export class CommonValidators extends Validators {
  static autoTips: Record<string, Record<string, string>> = {
    km: {
      required: "ទាមទារការបញ្ចូល!",
    },
    en: {
      required: "Input is required!",
    },
    default: {},
  };
  public name: string = "name";
  public nameEn: string = "nameEn";
  // static override maxLength(maxLength: number): ValidatorFn {
  //   return (control: AbstractControl): MyValidationErrors | null => {
  //     if (Validators.maxLength(maxLength)(control) === null) {
  //       return null;
  //     }
  //     return {maxlength: { km_KH: `មិនត្រូវបញ្ចូលលើសពី ${maxLength}តួអក្សរទេ!`, en: `Must not exceed ${maxLength} characters!`}};
  //   };
  // }
  static imageValidator(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;
    const isImageUrl =
      /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp|svg))$/i.test(value);
    const isBase64Image =
      /^data:image\/(png|jpg|jpeg|gif|bmp|webp|svg);base64,[A-Za-z0-9+/]+={0,2}$/.test(
        value
      );

    if (!isImageUrl && !isBase64Image) {
      return {
        base64ImageValidator: {
          km: `ទិន្នន័យមិនត្រឹមត្រូវ!`,
          en: `data is not valid!`,
        },
      };
    }
    return null;
  }
  static codeMaxLengthValidator(maxLength: number = 50): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          km: `មិនត្រូវបញ្ចូលលើសពី ${maxLength}តួអក្សរទេ!`,
          en: `Must not exceed ${maxLength} characters!`,
        },
      };
    };
  }
  static nameMaxLengthValidator(maxLength: number = 500): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          km: `មិនត្រូវសរសេរលើសពី ${maxLength}អក្សរ!`,
          en: `Must not exceed ${maxLength} characters!`,
        },
      };
    };
  }
  static noteMaxLengthValidator(maxLength: number = 2000): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          km: `មិនត្រូវសរសេរលើសពី ${maxLength}អក្សរ!`,
          en: `Must not exceed ${maxLength} characters!`,
        },
      };
    };
  }
  static withOtherExistsValidator(
    service: any,
    id: number = 0,
    controlName: string = "",
    otherControlName: string = "",
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [];

            // other fields.
            if (otherControlName) {
              let otherValue = control.parent?.value[otherControlName];
              params.push({
                key: otherControlName,
                val: otherValue ?? "",
              });
            }
            if (controlName) {
              params.push({
                key: controlName,
                val: control.value,
              });
            }
            service.exists("", id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: message || "មានរួចហើយ!",
                    en: message || "Already exists!",
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }
  static nameExistValidator(
    service: any,
    id: number = 0,
    controlName: string = "",
    parentId: number = 0,
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [];
            if (parentId) {
              params.push({
                key: "parentId",
                val: parentId,
              });
            }
            if (controlName) {
              params.push({
                key: controlName,
                val: control.value,
              });
            }
            service
              .exists(control.value, id, params)
              .subscribe((result: boolean) => {
                if (result) {
                  observer.next({
                    duplicated: {
                      km: message || "ឈ្មោះមានរួចហើយ!",
                      en: message || "Name already exists!",
                    },
                  });
                } else {
                  observer.next(null);
                }
                observer.complete();
              });
          }
        }, 600);
      });
  }
  static codeExistValidator(
    service: any,
    id: number = 0,
    parentId: number = 0,
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [
              {
                key: "code",
                val: control.value,
              },
            ];
            if (parentId) {
              params.push({
                key: "parentId",
                val: parentId,
              });
            }
            service.exists("", id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: message || "កូដមានរួចហើយ!",
                    en: message || "Code already exists!",
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }
  static phoneExistValidator(
    service: any,
    id: number = 0,
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [
              {
                key: "phone",
                val: control.value,
              },
            ];
            service.exists("", id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: message || "លេខទូរស័ព្ទមានរួចហើយ!",
                    en: message || "Phone number is already exists!",
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }
  static emailExistValidator(
    service: any,
    id: number = 0,
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [
              {
                key: "email",
                val: control.value,
              },
            ];
            service.exists("", id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: message || "អុីមែលមានរួចហើយ!",
                    en: message || "email is already exists!",
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }
  static barcodeExistValidator(
    service: any,
    id: number = 0,
    message: string = ""
  ): any {
    return (control: UntypedFormControl) =>
      new Observable((observer: Observer<Validators | null>) => {
        if (id) {
          if (!(control.value && control.dirty)) {
            observer.next(null);
            observer.complete();
            return;
          }
        }
        setTimeout(() => {
          if (control.value && control.status) {
            const params = [
              {
                key: "barcode",
                val: control.value,
              },
            ];
            service.exists("", id, params).subscribe((result: boolean) => {
              if (result) {
                observer.next({
                  duplicated: {
                    km: message || "បាកូដមានរួចហើយ!",
                    en: message || "Barcode already exists!",
                  },
                });
              } else {
                observer.next(null);
              }
              observer.complete();
            });
          }
        }, 600);
      });
  }

  static integerValidator(control: AbstractControl): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isInteger(value: any): boolean {
      return typeof value === "string" && /^\d+$/.test(value);
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isInteger(control.value?.toString())
      ? null
      : {
          integerValidator: {
            km: `ការបញ្ចូលមិនត្រឹមត្រូវ!`,
            en: `Input is not valid!`,
          },
        };
  }

  static notSpaceValidator(
    control: AbstractControl
  ): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isInteger(value: any): boolean {
      return typeof value === "string" && /^\S*$/.test(value);
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isInteger(control.value)
      ? null
      : {
          integerValidator: {
            km: `ការបញ្ចូលមិនអាចដកឃ្លា!`,
            en: `Input cannot be spaces!`,
          },
        };
  }

  static emailValidator(control: AbstractControl): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isEmail(value: string): boolean {
      return (
        typeof value === "string" &&
        /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
      );
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isEmail(control.value)
      ? null
      : {
          emailValidator: {
            km: `អុីមែលមិនត្រឹមត្រូវ!`,
            en: `Email is not valid!`,
          },
        };
  }

  static priceValidator(control: AbstractControl): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isPrice(value: any): boolean {
      return typeof value === "string" && /^\d+(.\d{1,6})?$/.test(value);
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isPrice(control.value)
      ? null
      : {
          integerValidator: {
            km: `ការបញ្ចូលមិនត្រឹមត្រូវ!`,
            en: `Input is not valid!`,
          },
        };
  }

  static decimalValidator(control: AbstractControl): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isDecimal(value: any): boolean {
      if (typeof value === "number") {
        return true;
      }
      value = (value || "").replace(/[, ]/g, "");
      return /^([-+]?)+\d+([.]\d*)?$/.test(value);
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isDecimal(control.value)
      ? null
      : {
          decimalValidator: {
            km: `ការបញ្ចូលមិនត្រឹមត្រូវ!`,
            en: `Input is not valid!`,
          },
        };
  }

  static singlePhoneValidator(
    control: AbstractControl
  ): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isPhoneNumber(value: any): boolean {
      // /^((\+\d{1,3}|0)(\d{2})(\d{6,7})(([\/])(\+\d{1,3}|0)(\d{2})(\d{6,7}))*)*$/ for multiple phone input
      return (
        typeof (value === "string" || value === "number") &&
        /^((\+\d{1,3}|0)(\d{2})(\d{6,7}))$/.test(value.replace(/ /g, ""))
      );
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isPhoneNumber(control.value)
      ? null
      : {
          phoneValidator: {
            km: `លេខទូរសព្ទមិនត្រឹមត្រូវ!`,
            en: `Phone number is not valid!`,
          },
        };
  }

  static multiplePhoneValidator(
    control: AbstractControl
  ): MyValidationErrors | null {
    function isEmptyInputValue(value: NzSafeAny): boolean {
      return value == null || value.length === 0;
    }
    function isPhoneNumber(value: any): boolean {
      // /^((\+\d{1,3}|0)(\d{2})(\d{6,7})(([\/])(\+\d{1,3}|0)(\d{2})(\d{6,7}))*)*$/ for multiple phone input
      return (
        typeof (value === "string" || value === "number") &&
        /^((\+\d{1,3}|0)(\d{2})(\d{6,7})(([\/])(\+\d{1,3}|0)(\d{2})(\d{6,7}))*)*$/.test(
          value.replace(/ /g, "")
        )
      );
    }
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    return isPhoneNumber(control.value)
      ? null
      : {
          phoneValidator: {
            km: `លេខទូរសព្ទមិនត្រឹមត្រូវ!`,
            en: `Phone number is not valid!`,
          },
        };
  }
  static mustBiggerDateValidator(starDate: Date, message: string = ""): any {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (control.value && starDate > control.value) {
        return {
          dateInvalid: {
            km: message || "ថ្ងៃបញ្ចប់ត្រូវតែធំជាងថ្ងៃចាប់ផ្តើម!",
            en: message || "End Date must be bigger than Start Date!",
          },
        };
      }
      return null;
    };
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          mustMatch: {
            km: "ពាក្យសម្ងាត់និងបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នា!",
            en: "Password and confirm not match!",
          },
        });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  static startLessThanEnd(
    startControlName: string,
    endControlName: string
  ): ValidatorFn {
    return (group: AbstractControl): MyValidationErrors | null => {
      const startControl = group.get(startControlName);
      const endControl = group.get(endControlName);

      if (!startControl || !endControl) {
        return null;
      }

      if (
        startControl.value !== null &&
        endControl.value !== null &&
        startControl.value > endControl.value
      ) {
        startControl.setErrors({
          rangeError: {
            km: "លេខចាប់ផ្តើមមិនអាចធំជាងលេខបញ្ចប់!",
            en: "Start number cannot be greater than end number!",
          },
        });
      } else {
        startControl.setErrors({
          rangeError: null,
        });
      }
      return null;
    };
  }
}
