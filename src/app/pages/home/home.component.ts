import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";
import { Dashboard, HomeService } from "./home.service";
import { Subscription } from "rxjs";
import { AccountTypes } from "../lookup/lookup-type.service";
import { TranslateService } from "@ngx-translate/core";
import { AccountUiService } from "../account/account-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys, SIZE_COLUMNS } from "../../const";
import { MemberUiService } from "../member/member-ui.service";
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
@Component({
  selector: "app-home",
  template: ` <nz-layout class="dashboard-layout">
    <!-- Header -->
    <!-- <nz-header>
      <h2>
        {{ "Summary" | translate }}
      </h2>
    </nz-header> -->

    <nz-content class="dashboard-content">
      <div
        class="row"
        nz-row
        [nzGutter]="[16, 16]"
        style="margin:0px !important;"
      >
        <div nz-col [nzSpan]="24" [nzSm]="24" [nzMd]="8" [nzXl]="4" [nzXXl]="4">
          <div class="card two-col-card">
            <ng-container *ngIf="!isLoading(); else loadingData">
              <div class="inside-card">
                <div nz-flex nzAlign="center" nzGap="small">
                  <div class="icon-wrapper">
                    <i
                      nz-icon
                      nzType="idcard"
                      nzTheme="outline"
                      class="icon-small"
                    ></i>
                  </div>
                  <span class="graph-label">{{ "Member" | translate }}</span>
                </div>
                <span class="value-number">{{
                  data.summary?.totalUsers || 0
                }}</span>
              </div>

              <nz-divider></nz-divider>

              <!-- agent -->
              <div class="inside-card">
                <div nz-flex nzAlign="center" nzGap="small">
                  <div class="icon-wrapper">
                    <app-agent-icon class="icon-small" />
                  </div>
                  <span class="graph-label">{{ "Agent" | translate }}</span>
                </div>
                <span class="value-number">{{
                  data.summary?.agents || 0
                }}</span>
              </div>
            </ng-container>

            <ng-template #loadingData>
              <app-loading />
            </ng-template>
          </div>
        </div>

        <div
          nz-col
          [nzSpan]="24"
          [nzSm]="24"
          [nzMd]="16"
          [nzXl]="10"
          [nzXXl]="10"
        >
          <div class="card" style="position:relative">
            <span class="graph-label">{{ "MemberClass" | translate }}</span>
            @if(isLoading()){
            <div class="graph-noresult">
              <app-loading> </app-loading>
            </div>
            } @else if (memberClassChart) {
            <div nz-row style="align-items:center; gap: 8px; flex-wrap:nowrap;">
              <div nz-col nzFlex="14">
                <app-graph
                  style=" width:90%; display:inline-block;"
                  [config]="memberClassChart"
                ></app-graph>
              </div>
              <div nz-col nzFlex="10" style="min-width: fit-content;">
                <ng-container
                  *ngFor="let d of data?.membersByClass; let i = index"
                >
                  <nz-badge
                    [nzColor]="backgroundColor[i % backgroundColor.length]"
                    [nzText]="d.name + ': ' + d.count"
                  ></nz-badge>
                  <br />
                </ng-container>
              </div>
            </div>
            }@else{
            <div class="graph-noresult">
              <app-no-result-found> </app-no-result-found>
            </div>
            }
          </div>
        </div>

        <div
          nz-col
          [nzSpan]="24"
          [nzSm]="24"
          [nzMd]="24"
          [nzXl]="10"
          [nzXXl]="10"
        >
          <div class="card agent-card" style="position:relative">
            <span class="graph-label">{{ "Agent" | translate }}</span>
            @if(isLoading()){
            <div class="graph-noresult">
              <app-loading> </app-loading>
            </div>
            } @else if (topAgentChart) {
            <app-graph
              style="position: relative; width:100%;  display:inline-block; padding-top: 12px;"
              [config]="topAgentChart"
            ></app-graph>
            }@else{
            <div class="graph-noresult">
              <app-no-result-found> </app-no-result-found>
            </div>
            }
          </div>
        </div>

        <div nzFlex="12" nz-col>
          <div class="card-nopad">
            <h3>{{ "RecentTransaction" | translate }}</h3>
            <nz-table
              class="table"
              nz-col
              nzSize="small"
              nzShowSizeChanger
              #fixedTable
              nzTableLayout="fixed"
              [nzData]="data.recentTransactions || []"
              [nzLoading]="isLoading()"
              [nzNoResult]="noResult"
              [nzFrontPagination]="false"
            >
              <ng-template #noResult>
                <div class="graph-noresult">
                  <app-no-result-found> </app-no-result-found>
                </div>
              </ng-template>
              <thead>
                <tr>
                  <th nzWidth="30px">#</th>
                  <th nzEllipsis nzWidth="120px">
                    {{ "TransNo" | translate }}
                  </th>
                  <th nzEllipsis nzWidth="170px">
                    {{ "Date" | translate }}
                  </th>
                  <th nzEllipsis nzWidth="150px">
                    {{ "Member" | translate }}
                  </th>
                  <th nzEllipsis nzWidth="120px">
                    {{ "Type" | translate }}
                  </th>
                  <th nzEllipsis nzWidth="140px">
                    {{ "Location" | translate }}
                  </th>
                  <th nzWidth="100px" nzAlign="right">
                    {{ "Balance" | translate }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of data.recentTransactions; let i = index">
                  <td nzEllipsis>
                    {{ i | rowNumber : { index: 1, size: 1 } }}
                  </td>
                  <td nzEllipsis>
                    <a
                      *ngIf="
                        (d.accountType == AccountTypes.Wallet &&
                          isWalletView()) ||
                        (d.accountType == AccountTypes.Point && isPointView())
                      "
                      (click)="
                        accUiService.showTransaction(d.id || 0, d.accountType!)
                      "
                      >{{ d.tranNo }}</a
                    >
                    <span
                      *ngIf="
                        (d.accountType == AccountTypes.Wallet &&
                          !isWalletView()) ||
                        (d.accountType == AccountTypes.Point && !isPointView())
                      "
                      >{{ d.tranNo }}</span
                    >
                  </td>
                  <td nzEllipsis>
                    {{ d.date | customDateTime }}
                  </td>
                  <td nzEllipsis [title]="d.memberCode + ' ' + d.memberName">
                    {{ d.memberCode + " " + d.memberName }}
                  </td>
                  <td nzEllipsis>
                    {{
                      translateService.currentLang == "km" ? d.typeKh : d.typeEn
                    }}
                  </td>
                  <td nzEllipsis>
                    <span *ngIf="d.branchName">{{ d.branchName + ", " }}</span>
                    <span>
                      {{ d.location }}
                    </span>
                  </td>
                  <td
                    nzEllipsis
                    nzAlign="right"
                    [ngStyle]="{
                      color:
                        d.amount! > 0
                          ? 'black'
                          : d.amount! < 0
                          ? 'red'
                          : 'black',
                      'font-weight': 'semi-bold'
                    }"
                  >
                    {{ d.amount | accountBalance : d.accountType! : true }}
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </div>

        <div nzFlex="6" nz-col *ngIf="isWalletList()">
          <div class="card-nopad">
            <h3>{{ "TopBalance" | translate }}</h3>
            <nz-table
              class="table"
              nz-col
              nzSize="small"
              nzShowSizeChanger
              #fixedTable
              nzTableLayout="fixed"
              [nzData]="data.topBalances || []"
              [nzLoading]="isLoading()"
              [nzNoResult]="noResult"
              [nzFrontPagination]="false"
            >
              <ng-template #noResult>
                <div class="graph-noresult">
                  <app-no-result-found> </app-no-result-found>
                </div>
              </ng-template>
              <thead>
                <tr>
                  <th nzWidth="30px">#</th>
                  <th nzEllipsis nzWidth="140px">
                    {{ "Member" | translate }}
                  </th>
                  <th nzWidth="80px" nzAlign="right">
                    {{ "Balance" | translate }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of data.topBalances; let i = index">
                  <td nzEllipsis>
                    {{ i | rowNumber : { index: 1, size: 1 } }}
                  </td>
                  <td nzEllipsis>
                    @if (isMemberView()){
                    <a (click)="memberUiService.showView(d.id!)">{{
                      d.code
                    }}</a>
                    <span>{{ " " + d.name }}</span>
                    } @else {
                    <span>{{ d.code + " " + d.name }}</span>
                    }
                  </td>
                  <td
                    [title]="
                      d.balance | accountBalance : AccountTypes.Wallet : true
                    "
                    nzEllipsis
                    nzAlign="right"
                  >
                    {{
                      d.balance | accountBalance : AccountTypes.Wallet : true
                    }}
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </div>
        <div nzFlex="6" nz-col *ngIf="isPointList()">
          <div class="card-nopad">
            <h3>{{ "TopPoint" | translate }}</h3>
            <nz-table
              class="table"
              nz-col
              nzSize="small"
              nzShowSizeChanger
              #fixedTable
              nzTableLayout="fixed"
              [nzData]="data.topPoints || []"
              [nzLoading]="isLoading()"
              [nzNoResult]="noResult"
              [nzFrontPagination]="false"
            >
              <ng-template #noResult>
                <app-no-result-found style="margin-top: 100px;">
                </app-no-result-found>
              </ng-template>
              <thead>
                <tr>
                  <th nzWidth="30px">#</th>
                  <th nzEllipsis nzWidth="140px">
                    {{ "Member" | translate }}
                  </th>
                  <th nzWidth="80px" nzAlign="right">
                    {{ "Balance" | translate }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let d of data.topPoints; let i = index">
                  <td nzEllipsis>
                    {{ i | rowNumber : { index: 1, size: 1 } }}
                  </td>
                  <td nzEllipsis>
                    @if (isMemberView()){
                    <a (click)="memberUiService.showView(d.id!)">{{
                      d.code
                    }}</a>
                    <span>{{ " " + d.name }}</span>
                    } @else {
                    <span>{{ d.code + " " + d.name }}</span>
                    }
                  </td>
                  <td
                    [title]="
                      d.points | accountBalance : AccountTypes.Point : true
                    "
                    nzEllipsis
                    nzAlign="right"
                  >
                    {{ d.points | accountBalance : AccountTypes.Point : true }}
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </div>
      </div>
    </nz-content>
  </nz-layout>`,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .value-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .value-label {
        font-size: 24px;
        font-weight: 600;
      }
      .ant-badge-status-dot {
        width: 12px;
        height: 12px;
      }
      .dashboard-content {
        overflow: auto;
        .row {
          margin: 0 !important;
        }
      }
      .separator {
        margin: 0px !important;
      }
      .dashboard-layout {
        background-color: #eeeeee !important;
        padding: 14px;
        height: calc(100vh);
      }

      .graph-noresult {
        height: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .table {
        height: auto !important;
      }

      .two-col-card {
        display: flex;
        position: relative;
        padding: 0px;
        flex-direction: column;
      }
      .inside-card {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-grow: 2;
        // padding: 16px;
      }
      .agent-card {
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
      }

      .graph-label {
        font-size: 16px;
        font-weight: 600;
      }

      .card {
        border-radius: 6px;
        padding: 16px;
        min-height: 370px;
        height: 100%;
        background-color: #fff;
        overflow: auto;
      }
      .card-nopad {
        border-radius: 6px;
        min-height: 470px !important;
        background-color: #fff;
        padding: 8px;
        h3 {
          padding: 8px 4px;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .icon-wrapper {
        width: 32px;
        height: 32px;
        background-color: #f0f0f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-small {
        font-size: 16px;
      }

      .label {
        font-weight: 500;
        font-size: 14px;
      }

      .value-number {
        font-size: 50px;
        margin: auto;
      }
    `,
  ],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private service: HomeService,
    public accUiService: AccountUiService,
    public memberUiService: MemberUiService,
    private authService: AuthService,
    public translateService: TranslateService
  ) {}
  data: Dashboard = {};
  refreshSub: Subscription = new Subscription();
  isLoading = signal<boolean>(false);
  AccountTypes = AccountTypes;
  isWalletView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__VIEW)
  );
  isPointView = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__VIEW)
  );
  memberClassChart!: ChartConfiguration<"doughnut">;
  topAgentChart!: ChartConfiguration<"bar">;
  current = 0;
  backgroundColor = [
    "#4383F0",
    "#F45B69",
    "#29C785",
    "#FFB347",
    "#9B59B6",
    "#F39C12",
    "#16A085",
    "#E74C3C",
    "#8E44AD",
    "#3498DB",
  ];
  isMemberView = computed(
    () =>
      this.authService.isAuthorized(
        AuthKeys.APP__MEMBER__ACCOUNT__WALLET__LIST
      ) ||
      this.authService.isAuthorized(
        AuthKeys.APP__MEMBER__ACCOUNT__POINT__LIST
      ) ||
      this.authService.isAuthorized(AuthKeys.APP__MEMBER__CARD__LIST)
  );

  isWalletList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__WALLET__LIST)
  );
  isPointList = computed(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ACCOUNT__POINT__LIST)
  );
  ngOnInit(): void {
    this.dashboard();
  }

  dashboard(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.refreshSub = this.service.dashboard().subscribe({
        next: (result) => {
          this.data = result;
          this.setMemberClassChart();
          this.setTopAgentChart();
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, delay);
  }

  setMemberClassChart() {
    this.memberClassChart = {
      type: "doughnut",
      data: {
        labels: this.data?.membersByClass?.map((d) => d.name),
        datasets: [
          {
            label: this.translateService.instant("Count"),
            data: this.data?.membersByClass?.map((d) => d.count ?? 0) || [],
            backgroundColor: this.backgroundColor,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  }

  setTopAgentChart() {
    this.topAgentChart = {
      type: "bar",
      data: {
        labels: this.data?.topAgents?.map((d) => d.name),
        datasets: [
          {
            label: this.translateService.instant("Count"),
            data: this.data?.topAgents?.map((d) => d.value ?? 0) || [],
            backgroundColor: this.backgroundColor,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  }
  readonly SIZE_COLUMNS = SIZE_COLUMNS;

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
