import { MemberUiService } from "./member-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { TranslateService } from "@ngx-translate/core";
import { Filter, QueryParam } from "../../utils/services/base-api.service";
import { Account, AccountService } from "../account/account.service";
import { Component, input } from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";

@Component({
  selector: "app-account-tab",
  standalone: false,
  template: `
    <h3 style="font-weight: bold;">
      <nz-icon
        nzType="credit-card"
        nzTheme="outline"
        style="margin-right:4px"
      />{{ "Credit&Point" | translate }}
    </h3>

    <div nz-flex nzWrap="wrap" nzGap="middle">
      <app-loading *ngIf="isLoading()" />
      <div class="card" *ngFor="let data of lists()">
        <div class="card-content">
          <div>
            <ng-container *ngIf="data.accountType === 1">
              <nz-icon
                nzType="wallet"
                nzTheme="outline"
                style="color: #1890ff;"
              ></nz-icon>
            </ng-container>
            <ng-container *ngIf="data.accountType === 2">
              <nz-icon
                nzType="account-book"
                style="color: #52c41a;"
                nzTheme="outline"
              />
            </ng-container>
            <ng-container
              *ngIf="data.accountType !== 1 && data.accountType !== 2"
            >
              <nz-icon
                nzType="dollar"
                nzTheme="outline"
                style="color: #faad14;"
              ></nz-icon>
            </ng-container>
          </div>
          <span style=" font-size: 24px; font-weight: 600; color: #222;">
            {{ data.balance | number : "1.0-2" }}
          </span>
        </div>
        <a (click)="uiService.showTransaction(data.id || 0)">{{
          "TransactionHistory" | translate
        }}</a>
      </div>
    </div>
  `,
  styles: ` 
  .card{ 
    border-radius: 6px;  
    background-color: #fafafa;
    min-width: 220px ;
    padding: 16px ;
   
  } 

  .card-content{ 
    margin-bottom: 12px;
    display: flex; 
    align-items: center;
     line-height: 1;
    gap: 16px; font-size: 26px;
  }  
`,
})
export class AccountTabComponent extends BaseListComponent<Account> {
  constructor(
    service: AccountService,
    override uiService: MemberUiService,
    private authService: AuthService,
    sessionStorageService: SessionStorageService,
    public translateService: TranslateService
  ) {
    super(service, uiService, sessionStorageService, "account-tab-list");
  }
  memberId = input<number>(0);
  override ngOnInit(): void {
    const filters: Filter[] = [];
    filters.push({
      field: "memberId",
      operator: "eq",
      value: this.memberId(),
    });

    this.search(filters);
  }
}
