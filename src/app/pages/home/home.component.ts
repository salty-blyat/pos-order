import {
  Component,
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
import { Dashboard, DateRange, HomeService } from "./home.service";
import { Subscription } from "rxjs";
import { AccountTypes } from "../lookup/lookup-type.service";
import { DateService } from "../../utils/services/date.service";
import { TranslateService } from "@ngx-translate/core";
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
  template: ` <nz-layout class="layout">
    <!-- Header -->
    <nz-header>
      <nz-tabset
        (nzSelectedIndexChange)="onTabChange($event)"
        style="margin-left:auto;"
      >
        <nz-tab [nzTitle]="'Today' | translate"> </nz-tab>
        <nz-tab [nzTitle]="'ThisWeek' | translate"> </nz-tab>
        <nz-tab [nzTitle]="'ThisMonth' | translate"> </nz-tab>
        <nz-tab [nzTitle]="'ThisYear' | translate"> </nz-tab>
        <nz-tab [nzTitle]="'All' | translate"> </nz-tab>
        <!-- <nz-tab [nzTitle]="'Custom' | translate"> </nz-tab> -->
      </nz-tabset>
    </nz-header>

    <nz-content>
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

          <nz-divider style="margin:8px 0 !important"></nz-divider>

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
              <app-graph [config]="memberClassChart"></app-graph>
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
              <app-graph
                style="width:100%"
                [config]="topAgentChart"
              ></app-graph>
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
                <th nzEllipsis nzWidth="150px">
                  {{ "Date" | translate }}
                </th>
                <th nzEllipsis>
                  {{ "Member" | translate }}
                </th>
                <th nzEllipsis nzWidth="80px">
                  {{ "Type" | translate }}
                </th>
                <th nzEllipsis nzWidth="180px">{{ "Location" | translate }}</th>
                <th nzWidth="70px" nzAlign="right">
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
                  {{ d.id }}
                </td>
                <td nzEllipsis>
                  {{ d.date | customDateTime }}
                </td>
                <td nzEllipsis>{{ d.memberCode + " " + d.memberName }}</td>
                <td nzEllipsis>{{ d.type }}</td>
                <td nzEllipsis>{{ d.location }}</td>
                <td nzEllipsis nzAlign="right">{{ d.amount }}</td>
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
                <th nzEllipsis>
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
                <th nzEllipsis>
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
      .grid-one,
      .grid-two {
        display: grid;
        gap: 8px;
        margin-bottom: 8px;
      }

      /* Default: Mobile-first approach */
      .grid-one {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      .grid-two {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }

      /* Tablet screens */
      @media (min-width: 768px) {
        .grid-one {
          grid-template-columns: 1fr 2fr;
          grid-template-rows: 300px;
        }

        .grid-two {
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 400px;
        }
      }

      /* Desktop screens */
      @media (min-width: 1024px) {
        .grid-one {
          grid-template-columns: 4fr 10fr 10fr;
          grid-template-rows: 380px;
        }

        .grid-two {
          grid-template-columns: 12fr 6fr 6fr;
          grid-template-rows: 485px;
        }
      }

      /* Larger desktops */
      @media (min-width: 1300px) {
        .grid-one,
        .grid-two {
          grid-template-columns: 4fr 10fr 10fr;
        }
      }

      /////////////////////////////////////
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
      .ant-divider-horizontal {
        margin: 0 !important;
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
        margin-top: 12px;
        height: 100%;
      }
      .card {
        border-radius: 6px;
        padding: 16px;
        background: #fff;
        border: 1px solid #d9d9d9;
      }
      .card-nopad {
        border-radius: 6px;
        background: #fff;
        border: 1px solid #d9d9d9;
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
    public dateService: DateService,
    public translateService: TranslateService
  ) {}
  data: Dashboard = {};
  dateRange: DateRange = { fromDate: new Date(), toDate: new Date() };
  refreshSub: Subscription = new Subscription();
  isLoading = signal<boolean>(false);
  AccountTypes = AccountTypes;

  memberClassChart!: ChartConfiguration<"doughnut">;
  topAgentChart!: ChartConfiguration<"bar">;

  ngOnInit(): void {
    this.dashboard();
  }

  dashboard(delay: number = 50) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.refreshSub = this.service.dashboard(this.dateRange).subscribe({
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

  onTabChange(index: number): void {
    const today = new Date();
    let from: Date = today;
    let to: Date = today;

    switch (index) {
      case 0: // Today
        from = to = today;
        break;

      case 1: // This Week
        [from, to] = this.dateService.getWeekRange(today);
        break;

      case 2: // This Month
        [from, to] = this.dateService.getMonthRange(today);
        break;

      case 3: // This Year
        [from, to] = this.dateService.getYearRange(today);
        break;

      case 4: // All
        [from, to] = this.dateService.getAllDate();
        break;

      case 5:
        return;
    }

    this.dateRange = { fromDate: from, toDate: to };
    this.dashboard();
  }

  setMemberClassChart() {
    this.memberClassChart = {
      type: "doughnut",
      data: {
        labels: this.data?.membersByClass?.map((d) => d.name) || [],
        datasets: [
          {
            label: "Members by Class",
            data: this.data?.membersByClass?.map((d) => d.count ?? 0) || [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    };
  }

  setTopAgentChart() {
    this.topAgentChart = {
      type: "bar",
      data: {
        labels: this.data?.topAgents?.map((d) => d.name) || [],
        datasets: [
          {
            label: "Agent",
            data: this.data?.topAgents?.map((d) => d.value ?? 0) || [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
    };
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
