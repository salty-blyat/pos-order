import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MultiLanguageInput} from "../components/language-input.component";

@Pipe({
    name: 'mapLanguage',
    standalone: false
})

export class MapLanguagePipe implements PipeTransform {
  constructor(
    public translate: TranslateService,
  ) {}

   transform(val: any, currencyLang?: string): any {
    try {
      let language = JSON.parse(val);
      return language[currencyLang || this.translate.currentLang];
    }
    catch {
      return val;
    }
  }

}
