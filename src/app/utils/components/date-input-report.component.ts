import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { BehaviorSubject } from 'rxjs';
import { DateService } from '../services/date.service';
import { SessionStorageService } from '../services/sessionStorage.service';
import { DatetimeHelper } from '../../helpers/datetime-helper';
interface IRecentFilter {
  key?: string;
  val?: any;
}
@Component({
    selector: 'app-date-input-report',
    template: `
    <nz-date-picker
      *ngIf="value"
      [(ngModel)]="value"
      (ngModelChange)="onModalChange()"
      [nzAllowClear]="allowClear"
      (nzOnCalendarChange)="calendarChange($event)"
      nzFormat="dd-MM-yyyy"
      [nzShowToday]="true"
      [nzDisabled]="disabled"
      #nzDatePickerComponent
      style="width: 100%;"
    ></nz-date-picker>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateInputReportComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class DateInputReportComponent
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor
{
  @Input() allowClear: boolean = false;
  @Input() storageKey!: string;
  @Input() formControl!: AbstractControl;
  @Input() value: Date = new Date();
  @Input() defaultValue: Date = new Date();
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild('nzDatePickerComponent')
  nzDatePickerComponent!: NzDatePickerComponent;
  presetKey: string = 'custom';
  date!: any;
  recentFilter = new BehaviorSubject<IRecentFilter[]>(
    this.sessionStorageService.getValue('recent-filter') ?? []
  );
  disabled = false;
  constructor(
    private dateService: DateService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    if (!this.value) this.value = new Date();
    this.date = new Date();
    if (this.storageKey) {
      const savedPreset = this.recentFilterValue(this.storageKey) || {
        key: 'custom',
        val: new Date(),
      };
      setTimeout(() => {
        this.presetKey = savedPreset.key;
        if (this.defaultValue != undefined) {
          this.value = this.defaultValue;
        } else {
          this.value = savedPreset.val;
        }
        if (this.presetKey !== 'custom') {
          const found = this.date.filter((x: any) => x.key === savedPreset.key);
          if (found) {
            this.value = found[0].val;
          }
        }
        this.onModalChange();
      }, 60);
    } else {
      this.onModalChange();
    }
  }

  onModalChange() {
    let value = {
      id: this.value,
      label: `${DatetimeHelper.toShortDateString(new Date(this.value))}`,
    };
    this.valueChange.emit(value);
    this.onChangeCallback(value);
    this.onTouchedCallback(value);
  }
  applyDefaultValue(value: any) {
    try {
      this.value = new Date(value);
    } catch {
      this.value = new Date();
    }
    this.onModalChange();
  }

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  updatePreset(preset: { key: string; val: Date }): void {
    this.presetKey = preset.key;
    this.value = preset.val;
    this.onModalChange();
    this.updateStorage();
    this.nzDatePickerComponent.close();
  }

  calendarChange($event: string | any): void {
    if ($event) {
      this.value = $event;
    }
    this.presetKey = 'custom';
    this.updateStorage();
  }

  updateStorage(): void {
    if (!this.storageKey) {
      return;
    }
    if (!this.value) {
      return;
    }
    const savingData = {
      key: this.presetKey,
      val: this.value,
    };
    this.emitRecentFilter({
      key: this.storageKey,
      val: savingData,
    });
    this.onModalChange();
  }

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  log($event: any) {
    console.log($event);
  }

  recentFilterValue(key: string): any {
    return (
      this.recentFilter.value.find((item: any) => item.key === key)?.val ?? 0
    );
  }

  emitRecentFilter(recent: IRecentFilter): void {
    const recentFilters: IRecentFilter[] =
      this.sessionStorageService.getValue('recent-filter') ?? [];
    const exist = recentFilters.find((item) => item.key === recent.key);
    if (exist) {
      recentFilters.forEach((item) => {
        if (item.key === exist.key) {
          item.val = recent.val;
        }
      });
    } else {
      recentFilters.push(recent);
    }

    this.recentFilter.next(recentFilters);
    sessionStorage.setItem('recent-filter', JSON.stringify(recentFilters));
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
