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
import { AuthKeys } from "../../const";
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
      <div class="grid-one ">
        <div class="card two-col-card">
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
              <span class="label">{{ "Member" | translate }}</span>
            </div>

            <div class="value-row">
              <span class="value-label">{{ "Total" | translate }}</span>
              <span class="value-number">{{
                data.summary?.totalUsers
                  | peopleCount : translateService.currentLang
              }}</span>
            </div>
          </div>

          <nz-divider class="separator"></nz-divider>

          <!-- agent -->
          <div class="inside-card">
            <div nz-flex nzAlign="center" nzGap="small">
              <div class="icon-wrapper">
                <i
                  nz-icon
                  nzType="user"
                  nzTheme="outline"
                  class="icon-small"
                ></i>
              </div>
              <span class="label">{{ "Agent" | translate }}</span>
            </div>

            <div class="value-row">
              <span class="value-label">{{ "Total" | translate }}</span>
              <span class="value-number">{{
                data.summary?.agents || "0"
              }}</span>
            </div>
          </div>
        </div>

        <!-- top balance -->
        <div class="card">
          <span class="graph-label">{{ "MemberClass" | translate }}</span>
          <ng-container *ngIf="memberClassChart; else noResult">
            <div nz-flex nzJustify="center" class="graph">
              <app-graph
                style="width=100%"
                [config]="memberClassChart"
              ></app-graph>
            </div>
          </ng-container>

          <ng-template #noResult>
            <div class="graph-noresult">
              <app-no-result-found> </app-no-result-found>
            </div>
          </ng-template>
        </div>

        <div class="card agent-card">
          <span class="graph-label">{{ "Agent" | translate }}</span>

          <ng-container *ngIf="topAgentChart; else noResult">
            <div nz-flex nzAlign="end" class="graph">
              <app-graph [config]="topAgentChart"></app-graph>
            </div>
          </ng-container>

          <ng-template #noResult>
            <div class="graph-noresult">
              <app-no-result-found> </app-no-result-found>
            </div>
          </ng-template>
        </div>
      </div>

      <div class="grid-two">
        <div class="card-nopad" style="overflow:auto;">
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
                <th nzEllipsis nzWidth="140px">{{ "Location" | translate }}</th>
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
                    *ngIf="isWalletView() || isPointView()"
                    (click)="
                      accUiService.showTransaction(d.id || 0, d.accountType!)
                    "
                    >{{ d.tranNo }}</a
                  >
                  <span *ngIf="!isWalletView() || !isPointView()">{{
                    d.tranNo
                  }}</span>
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
                  <span *ngIf="!d.location">{{ d.location }}</span>
                  <span *ngIf="d.branchName">{{ d.branchName + ", " }}</span>
                  <span *ngIf="d.location">
                    {{ d.location }}
                  </span>
                </td>
                <td
                  nzEllipsis
                  nzAlign="right"
                  [ngStyle]="{
                    color:
                      d.amount! > 0 ? 'black' : d.amount! < 0 ? 'red' : 'black',
                    'font-weight': 'semi-bold'
                  }"
                >
                  {{ d.amount | accountBalance : d.accountType! : true }}
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>

        <!-- top balance -->
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
                <th nzEllipsis nzWidth="150px">
                  {{ "Member" | translate }}
                </th>
                <th nzWidth="100px" nzAlign="right">
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
                  {{ d.code + " " + d.name }}
                </td>
                <td nzEllipsis nzAlign="right">
                  {{ d.balance | accountBalance : AccountTypes.Wallet : true }}
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>

        <div class="  card-nopad">
          <h3>{{ "TopPoint" | translate }}</h3>
          <nz-table
            class="table"
            nz-col
            style="height:100%"
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
                <th nzEllipsis nzWidth="150px">
                  {{ "Member" | translate }}
                </th>
                <th nzWidth="100px" nzAlign="right">
                  {{ "Point" | translate }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of data.topPoints; let i = index">
                <td nzEllipsis>
                  {{ i | rowNumber : { index: 1, size: 1 } }}
                </td>
                <td nzEllipsis>
                  {{ d.name }}
                </td>
                <td nzEllipsis nzAlign="right">
                  {{ d.points | accountBalance : AccountTypes.Point : true }}
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </div>
    </nz-content>
  </nz-layout>`,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .dashboard-content {
        overflow: auto;
      }
      .separator {
        margin: 8px 0 !important;
      }
      .dashboard-layout {
        background-color: #eeeeee !important;
        padding: 14px;
        height: calc(100vh);
      }
      .custom-dropdown {
        position: absolute;
        padding: 0px 11px;
        right: -7px;
        top: -47px;
        color: transparent;
        z-index: 1000;
      }

      .grid-one,
      .grid-two {
        display: grid;
        gap: 8px;
        margin-bottom: 8px;
      }

      .grid-one {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      .grid-two {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
      /* Desktop screens */
      @media (min-width: 1024px) {
        .grid-one {
          grid-template-columns: 4fr 10fr 10fr;
          grid-template-rows: 380px;
        }

        .grid-two {
          grid-template-columns: 12fr 6fr 6fr;
          height: 55%;
        }
      }

      .graph-noresult {
        height: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .ant-tabs-tab {
        margin-left: 8px !important;
      }
      nz-table {
        height: auto !important;
      }

      .two-col-card {
        display: flex;
        flex-direction: column;
      }
      .inside-card {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-grow: 2;
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
      .graph {
        height: 100%;
      }
      .card {
        border-radius: 6px;
        padding: 16px;
        background: #fff;
      }
      .card-nopad {
        border-radius: 6px;
        background: #fff;
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
        background: #f0f0f0;
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

      .value-row {
        display: flex;
        margin-top: 16px;
        align-items: baseline;
        justify-content: space-between;
      }

      .value-label {
        font-weight: bold;
        font-size: 18px;
      }

      .value-number {
        font-size: 20px;
        font-weight: bold;
      }

      .ant-list-bordered .ant-list-header,
      .ant-list-bordered .ant-list-item {
        padding: 6px 16px 6px 16px;
      }
      .ant-list-header,
      .ant-list-item {
        padding: 6px 16px 6px 16px;
      }

      .layout {
        height: calc(100vh - 20px);
        overflow-y: scroll;
      }
    `,
  ],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private service: HomeService,
    public accUiService: AccountUiService,
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
        labels:
          this.data?.membersByClass?.map((d) => d.name! + ": " + d.count) || [],
        datasets: [
          {
            label: this.translateService.instant("Total"),
            data: this.data?.membersByClass?.map((d) => d.count ?? 0) || [],
            backgroundColor: this.backgroundColor,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    };
  }

  setTopAgentChart() {
    this.topAgentChart = {
      type: "bar",
      data: {
        labels:
          this.data?.topAgents?.map((d) => d.name! + ": " + d.value) || [],
        datasets: [
          {
            label: this.translateService.instant("Total"),
            data: this.data?.topAgents?.map((d) => d.value ?? 0) || [],
            backgroundColor: this.backgroundColor,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
