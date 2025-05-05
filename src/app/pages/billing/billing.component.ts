import {Component, signal, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'app-billing',
  template: `
      <nz-layout>
          <nz-sider class="billing-sider" nzWidth="220px" nzTheme="light">
              <ul nz-menu nzMode="inline">
                  <ul>
                      <li [nzMatchRouter]="isActive()"
                          [routerLink]="['/','billing','cycle']"
                          nz-menu-item>
                          <nz-icon nzType="redo" nzTheme="outline"></nz-icon>
                          <span>{{ 'Billing Cycle' | translate }}</span>
                      </li>
                      <li [nzMatchRouter]="isActive()"
                          [routerLink]="['/','billing','reading']"
                          nz-menu-item>
                          <nz-icon nzType="file-search" nzTheme="outline"></nz-icon>
                          <span>{{ 'Meter Reading' | translate }}</span>
                      </li>
                      <li [nzMatchRouter]="isActive()"
                          [routerLink]="['/','billing','extra-charge']"
                          nz-menu-item>
                          <nz-icon nzType="dollar-circle" nzTheme="outline"></nz-icon>
                          <span>{{ 'Extra Charge' | translate }}</span>
                      </li>
                  </ul>
              </ul>
          </nz-sider>
          <nz-layout>
              <nz-content class="billing-content">
                  <router-outlet></router-outlet>
              </nz-content>
          </nz-layout>
      </nz-layout>
  `,
  styles: [`
    .billing-sider {
      height: calc(100vh - 16px);
      border-right: 1px solid var(--ant-border-color);
       ul {
         ul {
           li:first-of-type{
            margin-top: 0 !important;
          }
        }
      }
    }

    .billing-content {
      padding: 0 0 0 14px;
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class BillingComponent{

  isActive = signal(true);

}