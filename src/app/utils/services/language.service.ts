 
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { LocalStorageService } from './localStorage.service'; 
import { MultiLanguageInput } from '../components/language-input.component';
import {TranslateService} from "@ngx-translate/core";
import { APP_STORAGE_KEY, Locale } from '../../const';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    public translate: TranslateService,
    private i18n: NzI18nService
  ) {}

  switchLanguage(key: any) {
    this.translate.use(key.localId);
    this.i18n.setLocale(key.local);
    this.setStorageValue({
      key: APP_STORAGE_KEY.Language,
      value: key.localId,
    });
  }
  getStorageValue<T>(key: string): T {
    return JSON.parse(<string>localStorage.getItem(key));
  }

  setStorageValue(option: { key: string; value: any }): void {
    if (localStorage.getItem(option.key)) {
      localStorage.removeItem(option.key);
    }
    localStorage.setItem(option.key, JSON.stringify(option.value));
  }

  initialLanguage() {
    let language: { local?: any; localId?: string } = {};
    for (let key in Locale) {
      if (
        Locale[key].localId == this.getStorageValue(APP_STORAGE_KEY.Language)
      ) {
        language = Locale[key];
        break;
      }
    }
    this.translate.use(language.localId ?? Locale.DEFAULT.localId);
    this.i18n.setLocale(language.local ?? Locale.DEFAULT.local);
  }

  mapLanguageWithCurrentLocalId(val: any, localId: string = '') {
    try {
      let languages: MultiLanguageInput[] = JSON.parse(val);
      return languages.find(
        (x) => x.localId == localId || this.translate.currentLang
      )?.val;
    } catch {
      return null;
    }
  }
}
