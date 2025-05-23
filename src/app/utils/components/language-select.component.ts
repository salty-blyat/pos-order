import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LANGUAGES, Locale } from "../../const";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { NzI18nService } from "ng-zorro-antd/i18n";

@Component({
  selector: "app-language-select",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LanguageSelectComponent,
      multi: true,
    },
  ],
  template: `
    <nz-select
      [ngModel]="localId"
      nzBorderless
      (ngModelChange)="onModalChange($event)"
      [nzCustomTemplate]="defaultTemplate"
      [nzDropdownMatchSelectWidth]="false"
    >
      <ng-container *ngFor="let lang of LANGUAGES">
        <nz-option
          nzCustomContent
          [nzLabel]="lang.label"
          [nzValue]="lang.key.localId"
        >
          <span (click)="switchLanguage(lang.key)">
            <img
              [src]="lang.image"
              alt=""
              style="width: 16px;margin-top: -4px;"
            />
            {{ lang.label }}
          </span>
        </nz-option>
      </ng-container>
    </nz-select>
    <ng-template #defaultTemplate let-selected>
      <img
        [src]="getLangImageByKey(selected.nzValue)"
        alt=""
        style="width: 16px"
      />
    </ng-template>
  `,
  standalone: false,
})
export class LanguageSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private translate: TranslateService,
    private i18n: NzI18nService
  ) {}
  @Input() localId: string = this.translate.currentLang || Locale.KH.localId;
  @Input() placeholder: any = "";
  @Input() disabled: boolean = false;
  @Output() onValueChange: EventEmitter<any> = new EventEmitter();
  LANGUAGES = LANGUAGES;
  onChange: any = () => {};
  onTouch: any = () => {};
  writeValue(val: any): void {
    this.localId = val;
  }

  switchLanguage(key: any) {
    this.translate.use(key.localId ?? "km");
    this.i18n.setLocale(key.local ?? "km");
  }
  onModalChange(value: any) {
    this.localId = value;
    this.onChange(this.localId);
    this.onTouch(this.localId);
    this.onValueChange.emit(this.localId);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {}

  getLangImageByKey(localId: any) {
    return LANGUAGES.find((x) => x.key.localId == localId)?.image;
  }
}
