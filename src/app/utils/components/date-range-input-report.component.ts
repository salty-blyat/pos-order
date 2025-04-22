import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DateRangeInputComponent } from './date-range-input.component';
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
    selector: 'app-date-range-input-report',
    template: `
    <nz-range-picker
      *ngIf="value"
      [(ngModel)]="value"
      (ngModelChange)="onModalChange()"
      [nzAllowClear]="allowClear"
      (nzOnCalendarChange)="calendarChange($event)"
      nzFormat="dd-MM-yyyy"
      [nzShowToday]="true"
      [nzRenderExtraFooter]="extraTemplate"
      [nzDisabled]="disabled"
      #nzDatePickerComponent
    ></nz-range-picker>
    <ng-template #extraTemplate>
      <div *ngIf="dateRanges">
        <span *ngFor="let item of dateRanges; let i = index">
          <nz-divider *ngIf="i > 0" nzType="vertical"></nz-divider>
          <a class="preset-item" (click)="updatePreset(item)">{{
            item.key | translate
          }}</a>
        </span>
      </div>
    </ng-template>
  `,
    styles: [
        `
      .preset-item {
        font-size: 13px;
      }

      nz-range-picker {
        width: 230px !important;
      }
    `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateRangeInputReportComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class DateRangeInputReportComponent
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor
{
  d1!: Date;
  @Input() allowClear: boolean = false;
  @Input() storageKey!: string;
  @Input() formControl!: AbstractControl;
  @Input() value: [Date, Date] = [this.d1, new Date()];
  @Input() defaultValue!: [Date, Date];
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild('nzDatePickerComponent')
  nzDatePickerComponent!: NzDatePickerComponent;
  presetKey: string = 'custom';
  @Input() dateRangeOptions = [
    'MonthToDate',
    'Today',
    'ThisWeek',
    'ThisMonth',
    'ThisYear',
  ];
  dateRanges!: any[];
  recentFilter = new BehaviorSubject<IRecentFilter[]>(
    this.sessionStorageService.getValue('recent-filter') ?? []
  );
  disabled = false;
  constructor(
    // private logic: LogicHelperService,
    private dateService: DateService,
    private sessionStorageService: SessionStorageService
  ) {}

  get presetRanges(): any {
    return this.dateService.getListRanges();
  }

  ngOnInit(): void {
    let today = new Date();
    this.d1 = new Date(today.getFullYear(), today.getMonth(), 1);

    // console.log(this.sessionStorageService.getValue('recent-filter'))
    if (!this.value) this.value = [new Date(), new Date()];

    this.dateRanges = this.dateService
      .getListRanges(this.value[0])
      .filter((item: { key: string }) =>
        this.dateRangeOptions.includes(item.key)
      );
    if (this.storageKey) {
      const savedPreset = this.recentFilterValue(this.storageKey) || {
        key: 'custom',
        val: [this.d1, new Date()],
      };
      setTimeout(() => {
        this.presetKey = savedPreset.key;
        if (this.defaultValue != undefined) {
          this.value = [this.defaultValue[0], this.defaultValue[1]];
        } else {
          this.value = savedPreset.val;
        }
        if (this.presetKey !== 'custom') {
          const found = this.dateRanges.filter(
            (x) => x.key === savedPreset.key
          );
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
      id: this.value.map((x) => this.formatDateToISO(x)).join(),
      label: `${DatetimeHelper.toShortDateString(
        new Date(this.value[0])
      )}~${DatetimeHelper.toShortDateString(new Date(this.value[1]))}`,
    };
    this.valueChange.emit(value);
    this.onChangeCallback(value);
    this.onTouchedCallback(value);
  }
  formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  applyDefaultValue(values: any) {
    try {
      this.value = [new Date(values[0]), new Date(values[1])];
    } catch {
      this.value = [new Date(), new Date()];
    }
    this.onModalChange();
  }

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  updatePreset(preset: { key: string; val: [Date, Date] }): void {
    this.presetKey = preset.key;
    this.value = [preset.val[0], preset.val[1]];
    this.onModalChange();
    this.updateStorage();
    this.nzDatePickerComponent.close();
  }

  calendarChange($event: string | any[]): void {
    this.dateRanges = this.dateService
      .getListRanges($event[0])
      .filter((item: { key: string }) =>
        this.dateRangeOptions.includes(item.key)
      );
    if ($event && $event.length === 2) {
      this.value = [$event[0], $event[1]];
    }
    this.presetKey = 'custom';
    this.updateStorage();
  }

  updateStorage(): void {
    if (!this.storageKey) {
      return;
    }
    if (
      !this.value ||
      this.value.length < 2 ||
      !this.value[0] ||
      !this.value[1]
    ) {
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
