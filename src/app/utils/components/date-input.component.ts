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
      nzFormat="yyyy-MM-dd"
      [(ngModel)]="value"
      (ngModelChange)="onModelChange($event)"
      [nzShowToday]="true"
      [nzDisabled]="disabled"
      nzMode="date"
      [nzShowTime]="nzShowTime"
      [ngClass]="isGroup ? 'date-input-left' : ''"
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
  styles: [
    `
      .date-input-left {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    `,
  ],
})
export class DateInputComponent implements ControlValueAccessor, OnInit {
  disabled = false;
  value: Date | null = null;
  @Input() defaultValue: Date | null = null;
  recentFilter = new BehaviorSubject<IRecentFilter[]>(
    this.sessionStorageService.getValue("recent-filter") ?? []
  );
  @Input() storageKey!: string; // Input for storage key
  @Output() valueChange = new EventEmitter<any>();
  @Input() allowClear: boolean = false;
  @Input() nzShowTime: boolean = false;
  @Input() isGroup: boolean = false;

  constructor(private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    if (this.storageKey) {
      const savedDate = this.recentFilterValue(this.storageKey);
      if (savedDate) {
        this.value = new Date(savedDate);
      }
    }

    if (this.value === null && this.defaultValue !== null) {
      this.value = this.defaultValue;
    }

    if (this.value) {
      this.onModelChange(this.value);
    }
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
    this.value = date;
    const emitted = date ? date : null;
    this.valueChange.emit(emitted);
    this.onChangeCallback(emitted);
    this.onTouchedCallback(emitted);

    // only save if date is non-null:
    if (date && this.storageKey) {
      this.emitRecentFilter({ key: this.storageKey, val: emitted });
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
