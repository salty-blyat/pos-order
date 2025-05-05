import {Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'app-meter-reading-list',
  template: `
      <nz-layout>
          <nz-header class="header-top">
              <div nz-row>
                  <div nz-col>
                      <app-filter-input></app-filter-input>
                  </div>
              </div>
          </nz-header>
          <nz-content>
              
          </nz-content>
      </nz-layout>
  `,
  styleUrls: ['../../../../assets/scss/list.style.scss'],
  styles: [`
    .header-top{
      align-items: flex-start;
      line-height: unset !important;
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})


export class MeterReadingListComponent {}