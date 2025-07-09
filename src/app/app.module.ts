import { inject, LOCALE_ID, NgModule, APP_INITIALIZER, createComponent } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { en_US, km_KH, NZ_I18N, zh_CN } from "ng-zorro-antd/i18n";
import {
  CommonModule, registerLocaleData
} from "@angular/common";
import en from "@angular/common/locales/en";
import km from "@angular/common/locales/km";
import zh from "@angular/common/locales/zh"; 
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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { catchError } from "rxjs/operators";


import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { AppVersionService } from "./utils/services/app-version.service";
import { NzFlexDirective } from "ng-zorro-antd/flex";
import { NzCodeEditorModule } from "ng-zorro-antd/code-editor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./pages/home/home.component";
import { NzLayoutComponent } from "ng-zorro-antd/layout";
import {  RedirectComponent } from "./redirect/redirect.component";
import { LanguageInputComponent } from "./utils/components/language-input.component";
import { DishComponent } from "./utils/components/dish.component";
import { CartComponent } from "./pages/home/cart.component"; 
import { CategoryButtonsComponent } from "./utils/components/category-buttons.component";
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
    HomeComponent,
    RedirectComponent,
    LanguageInputComponent, 
    DishComponent,
    CartComponent,
    CategoryButtonsComponent
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
    NzLayoutComponent
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
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
