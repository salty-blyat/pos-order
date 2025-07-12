import { Component, OnInit } from "@angular/core";
import { LanguageService } from "./utils/services/language.service";
import { AuthService } from "./helpers/auth.service";

@Component({
  selector: "app-root",
  template: ` 
    <router-outlet></router-outlet> `,
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.languageService.initialLanguage();
    this.authService.updateTitleTab();
  }
}
