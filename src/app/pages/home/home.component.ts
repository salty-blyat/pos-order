import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    template: ``,
    styles: [``],
    standalone: false
})
export class HomeComponent implements OnInit {
  constructor(public translate: TranslateService) {}
  ngOnInit(): void {}
}
