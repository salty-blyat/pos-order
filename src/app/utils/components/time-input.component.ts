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

interface IRecentFilter {
  key?: string;
  val?: any;
}

@Component({
  selector: "app-time-input",
  template: `
    <nz-time-picker
      [(ngModel)]="value"
      (ngModelChange)="onModelChange($event)"
      [nzDisabled]="disabled"
      nzFormat="HH:mm"
      [ngClass]="isGroup ? 'date-input-right' : ''"
      [nzAllowEmpty]="allowClear"
      style="width: 100% !important"
    ></nz-time-picker>
  `,
  styles: [
    `
      .date-input-right {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
      }
    `,
  ],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    },
  ],
})
export class TimeInputComponent implements ControlValueAccessor, OnInit {
  disabled = false;
  value: Date | null = null;

  @Input() defaultValue: Date = new Date(new Date().setHours(0, 0, 0, 0));
  @Input() storageKey!: string;
  @Output() valueChange = new EventEmitter<any>();
  @Input() allowClear: boolean = false;
  @Input() isGroup: boolean = false;

  recentFilter = new BehaviorSubject<IRecentFilter[]>(
    this.sessionStorageService.getValue("recent-filter") ?? []
  );

  constructor(private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.value = new Date();
    this.onModelChange(this.value);
  }

  applyDefaultValue(val: any) {
    try {
      this.value = new Date(val);
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

      if (this.storageKey) {
        this.emitRecentFilter({ key: this.storageKey, val: value });
      }
    }
  }

  emitRecentFilter(recent: IRecentFilter): void {
    const recentFilters: IRecentFilter[] =
      this.sessionStorageService.getValue("recent-filter") ?? [];

    const existing = recentFilters.find((item) => item.key === recent.key);
    if (existing) {
      existing.val = recent.val;
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
      this.recentFilter.value.find((item) => item.key === key)?.val ?? null
    );
  }

  // ControlValueAccessor implementation
  onChangeCallback: (val: any) => void = () => {};
  onTouchedCallback: (val: any) => void = () => {};

  writeValue(val: any): void {
    if (val) {
      try {
        this.value = new Date(val);
      } catch {
        this.value = null;
      }
    } else {
      this.value = null;
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
