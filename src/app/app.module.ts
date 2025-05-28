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
import { ReportGroupListComponent } from "./pages/report-group/report-group-list.component";
import { ReportListComponent } from "./pages/report/report-list.component";
import { ReportViewComponent } from "./pages/report/report-view.component";
import { StaticDropdownMultipleSelectComponent } from "./pages/report/static-dropdown-multiple-select.component";
import { StaticDropdownSingleSelectComponent } from "./pages/report/static-dropdown-single-select.component";
import { ReportOperationComponent } from "./pages/report/report-operation.component";
import { ReportGroupMenuComponent } from "./pages/report-group/report-group-menu.component";
import { BlockListComponent } from "./pages/block/block-list.component";
import { BlockOperationComponent } from "./pages/block/block-operation.component";
import { FloorListComponent } from "./pages/floor/floor-list.component";
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
import { DateInputComponent } from "./utils/components/date-input.component";
import { AppVersionService } from "./utils/services/app-version.service";
import { NzFlexDirective } from "ng-zorro-antd/flex";
import { InputNumberComponent } from "./utils/components/input-number.component";
import { MemberListComponent } from "./pages/member/member-list.component";
import { NzCodeEditorModule } from "ng-zorro-antd/code-editor";
import { MemberDeleteComponent } from "./pages/member/member-delete.component";
import { MemberPullComponent } from "./pages/member/member-pull.component";
import { MemberSelectComponent } from "./pages/member/member-select.component";
import { TransparentPipe } from "./utils/pipes/transparent.pipe";
import { LocationListComponent } from "./pages/location/location-list.component";
import { LocationOperationComponent } from "./pages/location/location-operation.component";
import { LocationDeleteComponent } from "./pages/location/location-delete.component";
import { BranchSelectComponent } from "./pages/branch/branch-select.component";
import { BranchListComponent } from "./pages/branch/branch-list.component";
import { BranchOperationComponent } from "./pages/branch/branch-operation.component";
import { UserPopupSelectComponent } from "./pages/branch/user-popup-select.component";
import { BranchDeleteComponent } from "./pages/branch/branch-delete.component";
import { AgentListComponent } from "./pages/agent/agent-list.component";
import { AgentOperationComponent } from "./pages/agent/agent-operation.component";
import { AgentDeleteComponent } from "./pages/agent/agent-delete.component";
import { MemberClassListComponent } from "./pages/member-class/member-class-list.component";
import { MemberClassDeleteComponent } from "./pages/member-class/member-class-delete.component";
import { MemberClassOperationComponent } from "./pages/member-class/member-class-operation.component";
import { MemberClassSelectComponent } from "./pages/member-class/member-class-select.component";
import { OfferGroupListComponent } from "./pages/offer-group/offer-group-list.component";
import { OfferGroupOperationComponent } from "./pages/offer-group/offer-group-operation.component";
import { ItemUploadComponent } from "./pages/offer-group/item-upload.component";
import { OfferGroupDeleteComponent } from "./pages/offer-group/offer-group-delete.component";
import { OfferGroupSelectComponent } from "./pages/offer-group/offer-group-select.component";
import { AgentSelectComponent } from "./pages/agent/agent-select.component";
import { OfferListComponent } from "./pages/offer/offer-list.component";
import { OfferOperationComponent } from "./pages/offer/offer-operation.component";
import { OfferDeleteComponent } from "./pages/offer/offer-delete.component";
import { RedemptionDeleteComponent } from "./pages/redemption/redemption-delete.component";
import { RedemptionListComponent } from "./pages/redemption/redemption-list.component";
import { MemberOperationComponent } from "./pages/member/member-operation.component";
import { RedemptionOperationComponent } from "./pages/redemption/redemption-operation.component";
import { LocationSelectComponent } from "./pages/location/location-select.component";
import { OfferSelectComponent } from "./pages/offer/offer-select.component";
import { CardListComponent } from "./pages/card/card-list.component";
import { CardOperationComponent } from "./pages/card/card-operation.component";
import { CardDeleteComponent } from "./pages/card/card-delete.component";
import { AccountSelectComponent } from "./pages/account/account-select.component";
import { AccountListComponent } from "./pages/account/account-list.component";
import { AccountOperationComponent } from "./pages/account/account-operation.component";
import { LocationMultiSelectComponent } from "./pages/location/location-multi-select.component";

self.MonacoEnvironment = {
  getWorkerUrl: function () {
    return `assets/vs/base/worker/workerMain.js`;
  },
};

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
    TransparentPipe,
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
    // system setting sections
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
    ReportGroupListComponent,
    ReportDeleteComponent,
    ReportDynamicInputComponent,
    ReportFilterComponent,
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

    //tag
    TagGroupListComponent,
    TagGroupOperationComponent,
    TagGroupDeleteComponent,
    TagMultiSelectComponent,

    //member
    MemberListComponent,
    MemberOperationComponent,
    MemberDeleteComponent,
    MemberPullComponent,
    MemberSelectComponent,

    // card
    CardListComponent,
    CardOperationComponent,
    CardDeleteComponent,

    // location
    LocationListComponent,
    LocationSelectComponent,
    LocationOperationComponent,
    LocationDeleteComponent,
    LocationMultiSelectComponent,

    // branch
    BranchListComponent,
    BranchOperationComponent,
    BranchDeleteComponent,
    UserPopupSelectComponent,
    BranchSelectComponent,

    // member class
    MemberClassListComponent,
    MemberClassOperationComponent,
    MemberClassSelectComponent,
    MemberClassDeleteComponent,

    // offer group
    OfferGroupListComponent,
    OfferGroupOperationComponent,
    OfferGroupSelectComponent,
    OfferGroupDeleteComponent,
    ItemUploadComponent,

    //offer
    OfferListComponent,
    OfferSelectComponent,
    OfferOperationComponent,
    OfferDeleteComponent,

    // agent
    AgentListComponent,
    AgentOperationComponent,
    AgentDeleteComponent,
    AgentSelectComponent,

    // account
    AccountListComponent,
    AccountOperationComponent,
    AccountSelectComponent,

    //redem
    RedemptionDeleteComponent,
    RedemptionListComponent,
    RedemptionOperationComponent,
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
    NzCodeEditorModule,
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
    TransparentPipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
