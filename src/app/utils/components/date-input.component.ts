import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { SessionStorageService } from "../services/sessionStorage.service";
import { DisabledTimeConfig } from "ng-zorro-antd/date-picker";

interface IRecentFilter {
  key?: string;
  val?: any;
}

@Component({
  selector: "app-date-input",
  template: `
    <nz-date-picker
      [nzFormat]="nzShowTime ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'"
      [(ngModel)]="value"
      [nzDisabledTime]="nzDisabledTime"
      (ngModelChange)="onModelChange($event)"
      [nzShowToday]="true"
      [nzDisabled]="disabled"
      nzMode="date"
      [nzShowTime]="nzShowTime"
      style="width: 100% !important"
      [nzAllowClear]="allowClear"
    ></nz-date-picker>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class DateInputComponent implements ControlValueAccessor, OnInit {
  disabled = false;
  value: Date | null = null;
  @Input() defaultValue: Date = new Date();
  recentFilter = new BehaviorSubject<IRecentFilter[]>(
    this.sessionStorageService.getValue("recent-filter") ?? []
  );
  @Input() storageKey!: string; // Input for storage key
  @Output() valueChange = new EventEmitter<any>();
  @Input() allowClear: boolean = false;
  @Input() nzShowTime: boolean = false;

  constructor(private sessionStorageService: SessionStorageService) {}

  nzDisabledTime = () => {
    return {
      nzDisabledHours: () => [],
      nzDisabledMinutes: () => [],
      nzDisabledSeconds: () =>
        Array.from({ length: 60 }, (_, i) => i).filter((i) => i !== 0),
    };
  };

  ngOnInit(): void {
    if (!this.value) {
      this.value = new Date();
    }

    // If storageKey is provided, try to load the saved date from sessionStorage
    if (this.storageKey) {
      const savedDate = this.recentFilterValue(this.storageKey);
      if (savedDate) {
        this.value = new Date(savedDate);
      } else {
        // If no saved date, use the default value
        this.value = this.defaultValue;
      }
    }

    // Apply the default value
    this.applyDefaultValue(this.value);
  }

  applyDefaultValue(values: any) {
    try {
      this.value = new Date(values);
    } catch {
      this.value = new Date();
    }
    this.onModelChange(this.value);
  }

  onModelChange(date: Date | null) {
    if (date) {
      const value = date.toISOString();
      this.valueChange.emit(value);
      this.onChangeCallback(value);
      this.onTouchedCallback(value);

      // Save the selected date to sessionStorage if storageKey is provided
      if (this.storageKey) {
        this.emitRecentFilter({ key: this.storageKey, val: value });
      }
    }
  }

  emitRecentFilter(recent: IRecentFilter): void {
    const recentFilters: IRecentFilter[] =
      this.sessionStorageService.getValue("recent-filter") ?? [];

    const exist = recentFilters.find((item) => item.key === recent.key);
    if (exist) {
      exist.val = recent.val;
    } else {
      recentFilters.push(recent);
    }

    this.recentFilter.next(recentFilters);
    this.sessionStorageService.setValue({
      key: "recent-filter",
      value: recentFilters,
    });
  }

  recentFilterValue(key: string): any {
    return (
      this.recentFilter.value.find((item: any) => item.key === key)?.val ?? null
    );
  }

  // ControlValueAccessor implementation
  onChangeCallback: (val: any) => void = () => {};
  onTouchedCallback: (val: any) => void = () => {};

  writeValue(val: any): void {
    if (typeof val === "string") {
      if (val.includes("T")) {
        this.value = new Date(val.split("T")[0]);
      } else {
        this.value = val ? new Date(val) : null;
      }
    } else {
      this.value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
