import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  Request,
  RequestDetail,
  RequestService,
  RequestStatus,
} from "../request/request.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-history-detail",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;">{{ "Back" | translate }}</span>
      </button>
    </div>
    <div nz-row [nzGutter]="[16, 16]">
      <div nz-col nzXs="24" nzSm="24" nzMd="12">
        <div nz-flex nzVertical class="req-detail-card" nzGap="middle">
          <div class="header-history">
            <h3>
              <nz-icon nzType="info-circle" nzTheme="outline" />{{
                "Request Information " | translate
              }}
            </h3>
          </div>

          <div class="history-service">
            <h4>{{ "Service" | translate }}</h4>
            <p>
              {{ model?.serviceItemName || "model?.serviceItemName" }}
            </p>
          </div>
          <div nz-row style="padding: 0 16px;" nzGutter="16">
            <div nz-col nzSpan="12" *ngIf="model?.quantity! > 0">
              <span>{{ "Quantity" | translate }}</span> <br />
              <span
                style="text-align:center; font-size:16px; font-weight: bold;"
                >{{ model?.quantity || "model?.quantity" }}</span
              >
            </div>

            <div nz-col nzSpan="12">
              <span>{{ "Status" | translate }}</span> <br />
              <app-status-badge
              [statusText]="translateService.currentLang == 'en' ? model?.statusNameEn! : model?.statusNameKh!"
                [status]="model?.status ?? requestStatus.Pending"
              ></app-status-badge>
            </div>
          </div>
          <div class="request-time">
            <h4>{{ "Requested At" | translate }}</h4>
            <p>{{ model?.requestTime | customDateTime }}</p>
          </div>
        </div>
      </div>

      <div nz-col nzXs="24" nzSm="24" nzMd="12" *ngIf="model?.requestLogs?.length! > 0">
        <div nz-flex nzVertical class="req-detail-card" nzGap="middle">
          <div class="header-history">
            <h3>
              <nz-icon nzType="clock-circle" nzTheme="outline" />{{
                "Request Timeline " | translate
              }}
            </h3>
          </div>
          <nz-timeline >
            <nz-timeline-item *ngFor="let item of model?.requestLogs" [nzColor]="getBadgeBgColor(item.status)">
              <div nz-flex nzJustify="space-between">
                <h4>
                  {{item.staffName}}
                </h4>
                <span style='color:grey;'>
                  {{item.createdDate | customDateTime}} 
                </span>
              </div>
              <span>{{ translateService.currentLang == 'en' ?  
              item.statusNameEn : 
              item.statusNameKh
              }}</span>
              </nz-timeline-item
            >  
          </nz-timeline>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .header-history {
        h3 {
          nz-icon {
            margin-right: 8px;
          }
          font-weight: bold;
          font-size: 18px;
          margin-left: 8px;
        }
      }
      .req-detail-card {
        border-radius: 8px;
        background-color: white;
        padding: 16px;
      }
      .request-time {
        background-color: rgb(245, 245, 245);
        border: 1px solid #f3f4f6;
        padding: 16px;
        border-radius: 8px;
        h4 {
          font-weight: bold;
          color: grey;
        }
        p {
          margin: 0px;
          font-size: 18px; 
        }
      }

      .history-service {
        border: 1px solid rgb(219 234 254);
        padding: 16px;
        border-radius: 8px;
        background-color: #f0f6ff;
        h4 {
          font-weight: bold;
          color: grey;
        }
        p {
          margin: 0px;
          font-size: 18px;
          font-weight: bold;
        }
      }
    `,
  ],
  standalone: false,
})
export class HistoryDetailComponent implements OnInit {
  constructor(
    private location: Location,
    private requestService: RequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService
  ) { }
  isLoading: boolean = false;
  refresher = new Subscription();
  routeRefresher = new Subscription();
  requestRefresher = new Subscription();
  readonly requestStatus = RequestStatus;
  model!: RequestDetail;
  ngOnInit(): void {
    this.routeRefresher = this.activatedRoute.params.subscribe((params) => {
      this.isLoading = true;
      this.requestRefresher = this.requestService.find(params["id"]).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.model = res;
          console.log(this.model);

        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
    });
  }
  goBack() {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.routeRefresher?.unsubscribe();
    this.requestRefresher?.unsubscribe();
  }

  getBadgeBgColor(status: number | undefined): string {
    switch (status) {
      case 1:
        return "#d9d9d9";
      case 2:
        return "#1890ff";
      case 3:
        return "#52c41a";
      case 4:
        return "#f5222d";
      default:
        return "#d9d9d9";
    }
  }

}
