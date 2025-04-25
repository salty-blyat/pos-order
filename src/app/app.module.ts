import { inject, LOCALE_ID, NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { en_US, km_KH, NZ_I18N, zh_CN } from "ng-zorro-antd/i18n";
import {
  CommonModule,
  CurrencyPipe,
  DecimalPipe,
  registerLocaleData,
} from "@angular/common";
import en from "@angular/common/locales/en";
import km from "@angular/common/locales/km";
import zh from "@angular/common/locales/zh";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgZorroAntdModule } from "./ng-zorro-antd.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { PageComponent } from "./pages/page.component";
import { Observable } from "rxjs";
import { TokenInterceptor } from "./helpers/token.interceptor";
import { SettingHttpService, SettingService } from "./app-setting";
import { RedirectComponent } from "./redirect/redirect.component";

import { ScrollingModule } from "@angular/cdk/scrolling";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { catchError } from "rxjs/operators";
import { AutofocusDirective } from "./utils/directives/autofocus.directive";
import { CurrencyInputDirective } from "./utils/directives/currency-input.directive";
import { BaseListComponent } from "./utils/components/base-list.component";
import { BaseOperationComponent } from "./utils/components/base-operation.component";
import { BaseDeleteComponent } from "./utils/components/base-delete.component";
import { BaseSelectComponent } from "./utils/components/base-select.component";
import { BaseMultipleSelectComponent } from "./utils/components/base-multiple-select.component";
import { DateInputReportComponent } from "./utils/components/date-input-report.component";
import { DateRangeInputComponent } from "./utils/components/date-range-input.component";
import { DateRangeInputReportComponent } from "./utils/components/date-range-input-report.component";
import { FilterInputComponent } from "./utils/components/filter-input.component";
import { IndeterminateBarComponent } from "./utils/components/indeterminate-bar.component";
import { LanguageInputComponent } from "./utils/components/language-input.component";
import { LanguageSelectComponent } from "./utils/components/language-select.component";
import { NoResultFoundComponent } from "./utils/components/no-result-found.component";
import { AttendanceRatedPipe } from "./utils/pipes/attendance-rated.pipe";
import { ChunkPipe } from "./utils/pipes/chunk.pipe";
import { ConvertHourPipe } from "./utils/pipes/convert-hour.pipe";
import { CustomDatePipe } from "./utils/pipes/custom-date.pipe";
import { CustomDateTimePipe } from "./utils/pipes/custom-date-time.pipe";
import { CustomHourPipe } from "./utils/pipes/custom-hour.pipe";
import { CustomMinutePipe } from "./utils/pipes/custom-minute.pipe";
import { CustomCurrencyPipe } from "./utils/pipes/customCurrency.pipe";
import { LocalizedDatePipe } from "./utils/pipes/localized-date.pipe";
import { LocalizedDateTimePipe } from "./utils/pipes/localized-date-time.pipe";
import { MapLanguagePipe } from "./utils/pipes/map-language.pipe";
import { PrettyDate } from "./utils/pipes/pretty-date.pipe";
import { RowNumberPipe } from "./utils/pipes/row-number.pipe";
import { SafePipe } from "./utils/pipes/safe.pipe";
import { SubstrPipe } from "./utils/pipes/substr.pipe";
import { ToJsonPipePipe } from "./utils/pipes/to-json.pipe";

import { ItemTypeLabelPipe } from "./utils/pipes/item-type-label.pipe";
import { LocationTextPipe } from "./utils/pipes/location-text.pipe";
import { DecimalFormatPipe } from "./utils/pipes/decimal-format.pipe";

import { CodeEditorComponent } from "./utils/components/code-editor.component";
import { AutoNumberSectionComponent } from "./pages/system-setting/auto-number-section.component";
import { SystemSettingComponent } from "./pages/system-setting/system-setting.component";
import { BreadcrumbComponent } from "./pages/setting/breadcrumb.component";
import { SettingComponent } from "./pages/setting/setting.component";
import { LoadingComponent } from "./utils/components/loading.component";
import { LookupTypeComponent } from "./pages/lookup/lookup-type.component";
import { LookupItemListComponent } from "./pages/lookup/lookup-item/lookup-item-list.component";
import { LookupMultipleSelectComponent } from "./pages/lookup/lookup-item/lookup-multiple-select.component";
import { LookupItemDeleteComponent } from "./pages/lookup/lookup-item/lookup-item-delete.component";
import { LookupItemOperationComponent } from "./pages/lookup/lookup-item/lookup-item-operation.component";
import { LookupItemSelectComponent } from "./pages/lookup/lookup-item/lookup-item-select.component";
import { AutoNumberDeleteComponent } from "./pages/auto-number/auto-number-delete.component";
import { AutoNumberOperationComponent } from "./pages/auto-number/auto-number-operation.component";
import { AutoNumberSelectComponent } from "./pages/auto-number/auto-number-select.component";
import { AutoNumberListComponent } from "./pages/auto-number/auto-number-list.component";
import { CurrencyDeleteComponent } from "./pages/currency/currency-delete.component";
import { CurrencyOperationComponent } from "./pages/currency/currency-operation.component";
import { CurrencySelectComponent } from "./pages/currency/currency-select.component";
import { CurrencyListComponent } from "./pages/currency/currency-list.component";
import { CompanySectionComponent } from "./pages/system-setting/company-section.component";
import { ReportGroupDeleteComponent } from "./pages/report-group/report-group-delete.component";
import { ReportGroupOperationComponent } from "./pages/report-group/report-group-operation.component";
import { ReportGroupSelectComponent } from "./pages/report-group/report-group-select.component";
import { ReportDeleteComponent } from "./pages/report/report-delete.component";
import { ReportDynamicInputComponent } from "./pages/report/report-dynamic-input.component";
import { ReportFilterComponent } from "./pages/report/report-filter.component";
import { ReportNewListComponent } from "./pages/report/report-list-new.component";
import { ReportListComponent } from "./pages/report/report-list.component";
import { ReportViewComponent } from "./pages/report/report-view.component";
import { StaticDropdownMultipleSelectComponent } from "./pages/report/static-dropdown-multiple-select.component";
import { StaticDropdownSingleSelectComponent } from "./pages/report/static-dropdown-single-select.component";
import { ReportOperationComponent } from "./pages/report/report-operation.component";
import { ReportGroupMenuComponent } from "./pages/report-group/report-group-menu.component";
import { BlockListComponent } from "./pages/block/block-list.component";
import { BlockOperationComponent } from "./pages/block/block-operation.component";
import { FloorListComponent } from "./pages/floor/floor-list.component";
import { RoomTypeDeleteComponent } from "./pages/room-type/room-type-delete.component";
import { RoomDeleteComponent } from "./pages/room/room-delete.component";
import { RoomListComponent } from "./pages/room/room-list.component";
import { RoomTypeSelectComponent } from "./pages/room-type/room-type-select.component";
import { BlockDeleteComponent } from "./pages/block/block-delete.component";
import { BlockSelectComponent } from "./pages/block/block-select.component";
import { FloorOperationComponent } from "./pages/floor/floor-operation.component";
import { FloorDeleteComponent } from "./pages/floor/floor-delete.component";
import { FloorSelectComponent } from "./pages/floor/floor-select.component";
import { TagGroupListComponent } from "./pages/tag/tag-group-list.component";
import { TagGroupOperationComponent } from "./pages/tag/tag-group-operation.component";
import { TagGroupDeleteComponent } from "./pages/tag/tag-group-delete.component";
import { TagMultiSelectComponent } from "./pages/tag/tag-multi-select.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { RoomAdvancedFilterComponent } from "./pages/room/room-advanced-filter.component";
import { DateInputComponent } from "./utils/components/date-input.component";
import { RoomTypeOperationComponent } from "./pages/room-type/room-type-operation.component";
import { RoomOperationComponent } from "./pages/room/room-operation.component";
import { RoomSelectComponent } from "./pages/room/room-select.component";
import { AppVersionService } from "./utils/services/app-version.service";
import { NzFlexDirective } from "ng-zorro-antd/flex";
import { InputNumberComponent } from "./utils/components/input-number.component";
import { RoomOperationAddComponent } from "./pages/room/room-operation-add.component";
import { MemberListComponent } from "./pages/member/member-list.component";
import { MemberOperationComponent } from "./pages/member/member-operation.component";
import { ItemListComponent } from "./pages/item/item-list.component";
import { ItemOperationComponent } from "./pages/item/item-operation.component";
import { ItemTypeListComponent } from "./pages/item-type/item-type-list.component";
import { ItemTypeOperationComponent } from "./pages/item-type/item-type-operation.component";
import { ItemTypeDeleteComponent } from "./pages/item-type/item-type-delete.component";
import { RoomTypeListComponent } from "./pages/room-type/room-type-list.component";
import { ItemTypeSelectComponent } from "./pages/item-type/item-type-select.component";
import { ItemDeleteComponent } from "./pages/item/item-delete.component";
import { MemberLevelListComponent } from "./pages/member-level/member-level-list.component";
import { MemberLevelOperationComponent } from "./pages/member-level/member-level-operation.component";
import { MemberLevelDeleteComponent } from "./pages/member-level/member-level-delete.component";
import { UnitListComponent } from "./pages/unit/unit-list.component";
import { UnitOperationComponent } from "./pages/unit/unit-operation.component";
import { UnitDeleteComponent } from "./pages/unit/unit-delete.component";
import { ItemUnitListComponent } from "./pages/item-unit/item-unit-list.component";
import { ItemUnitOperationComponent } from "./pages/item-unit/item-unit-operation.component";
import { ItemUnitDeleteComponent } from "./pages/item-unit/item-unit-delete.component";
import { GroupDeleteComponent } from "./pages/group/group-delete.component";
import { GroupListComponent } from "./pages/group/group-list.component";
import { GroupOperationComponent } from "./pages/group/group-operation.component";
export function app_Init(settingsHttpService: SettingHttpService) {
  return () => settingsHttpService.initializeApp();
}

export function initializeVersion(appVersion: AppVersionService) {
  return () => appVersion.initializeVersion();
}

registerLocaleData(km);
registerLocaleData(en);
registerLocaleData(zh);

export class CustomTranslate implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private settingService: SettingService
  ) {}
  getTranslation(lang: string): Observable<any> {
    // Here we are making http call to our server to get the
    // translation files. lang will be our language for which we are
    // calling translations if it fails to get that language's
    // translation then translation should be called for en language.
    return this.http
      .get(`${this.settingService.setting.LANG_URL}-${lang}.json`)
      .pipe(catchError((_) => this.http.get(`/assets/i18n/${lang}.json`)));
  }
}

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    AutofocusDirective,
    CurrencyInputDirective,
    AttendanceRatedPipe,
    ChunkPipe,
    ConvertHourPipe,
    CustomDatePipe,
    CustomDateTimePipe,
    CustomHourPipe,
    CustomMinutePipe,
    CustomCurrencyPipe,
    LocalizedDatePipe,
    LocalizedDateTimePipe,
    MapLanguagePipe,
    PrettyDate,
    RowNumberPipe,
    SafePipe,
    SubstrPipe,
    ToJsonPipePipe,
    ItemTypeLabelPipe,
    LocationTextPipe,
    DecimalFormatPipe,
    BaseListComponent,
    BaseOperationComponent,
    BaseDeleteComponent,
    BaseSelectComponent,
    BaseMultipleSelectComponent,
    DateInputReportComponent,
    DateRangeInputComponent,
    DateInputComponent,
    DateRangeInputReportComponent,
    FilterInputComponent,
    IndeterminateBarComponent,
    LanguageInputComponent,
    LanguageSelectComponent,
    NoResultFoundComponent,
    CompanySectionComponent,
    AutoNumberSectionComponent,
    CodeEditorComponent,
    CurrencyInputDirective,
    AutofocusDirective,
    RedirectComponent,
    SystemSettingComponent,
    SettingComponent,
    BreadcrumbComponent,
    LoadingComponent,
    LookupTypeComponent,
    LookupItemListComponent,
    LookupMultipleSelectComponent,
    LookupItemDeleteComponent,
    LookupItemOperationComponent,
    LookupItemSelectComponent,
    AutoNumberDeleteComponent,
    AutoNumberOperationComponent,
    AutoNumberSelectComponent,
    AutoNumberSectionComponent,
    AutoNumberListComponent,
    CurrencyDeleteComponent,
    CurrencyOperationComponent,
    CurrencySelectComponent,
    CurrencySelectComponent,
    CurrencyListComponent,

    ReportGroupDeleteComponent,
    ReportGroupOperationComponent,
    ReportGroupSelectComponent,
    ReportGroupMenuComponent,
    ReportDeleteComponent,
    ReportDynamicInputComponent,
    ReportFilterComponent,
    ReportNewListComponent,
    ReportListComponent,
    ReportViewComponent,
    ReportOperationComponent,
    StaticDropdownMultipleSelectComponent,
    StaticDropdownSingleSelectComponent,
    InputNumberComponent,

    //block
    BlockListComponent,
    BlockOperationComponent,
    BlockDeleteComponent,
    BlockSelectComponent,

    //floor
    FloorListComponent,
    FloorOperationComponent,
    FloorDeleteComponent,
    FloorSelectComponent,

    //room type
    RoomTypeListComponent,
    RoomTypeOperationComponent,
    RoomTypeDeleteComponent,
    RoomTypeSelectComponent,

    //room
    RoomListComponent,
    RoomOperationComponent,
    RoomDeleteComponent,
    RoomAdvancedFilterComponent,
    RoomSelectComponent,
    RoomOperationAddComponent,

    //tag
    TagGroupListComponent,
    TagGroupOperationComponent,
    TagGroupDeleteComponent,
    TagMultiSelectComponent,

    //member
    MemberListComponent,
    MemberOperationComponent,

    // member level
    MemberLevelListComponent,
    MemberLevelOperationComponent,
    MemberLevelDeleteComponent,

    // Item
    ItemListComponent,
    ItemOperationComponent,
    ItemDeleteComponent,

    // Item Type
    ItemTypeListComponent,
    ItemTypeOperationComponent,
    ItemTypeDeleteComponent,
    ItemTypeSelectComponent,

    // unit
    UnitListComponent,
    UnitOperationComponent,
    UnitDeleteComponent,

    // item unit
    ItemUnitListComponent,
    ItemUnitOperationComponent,
    ItemUnitDeleteComponent,

    // group
    GroupListComponent,
    GroupOperationComponent,
    GroupDeleteComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    BrowserAnimationsModule,
    NgZorroAntdModule,
    CommonModule,
    DragDropModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader, // Main provider for loader
        useClass: CustomTranslate, // Custom Loader
        deps: [HttpClient, SettingService], // Dependencies which helps serving loader
      },
      isolate: false,
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NzFlexDirective,
    TranslateModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: () => {
        const localId = inject(LOCALE_ID);
        switch (localId) {
          case "km":
            return km_KH;
          case "en":
            return en_US;
          case "zh":
            return zh_CN;
          /** keep the same with angular.json/i18n/locales configuration **/
          default:
            return km_KH;
        }
      },
      deps: [LOCALE_ID],
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingHttpService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeVersion,
      deps: [AppVersionService],
      multi: true,
    },
    DecimalPipe,
    CurrencyPipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
