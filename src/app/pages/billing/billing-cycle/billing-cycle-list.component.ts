import {Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'app-billing-cycle-list',
  template: `
      <nz-layout>
          <nz-header class="header-top">
              <div nz-row>
                  <div nz-col>
                      <app-filter-input></app-filter-input>
                  </div>
              </div>
              <div nz-row>
                  <button nz-button nzType="primary">
                      <i nz-icon nzType="plus"></i>
                      {{ 'Add' | translate }}
                  </button>
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

export class BillingCycleListComponent{

}