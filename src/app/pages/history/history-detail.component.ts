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
      <div nz-col nzXs="24" nzSm="24">
        <div nz-flex nzVertical class="req-detail-card" nzGap="small">
          @if(!isLoading && model){
          <div class="header-history">
            <h3>
              <nz-icon nzType="info-circle" nzTheme="outline" />{{
                "Request Information" | translate
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
              <span style="margin-bottom:2px;">{{ "Status" | translate }}</span> <br />
              <app-status-badge  
                [img]="model?.statusImage!"
                [statusText]="
                  translateService.currentLang == 'en'
                    ? model?.statusNameEn!
                    : model?.statusNameKh!
                " 
                [status]="model?.status ?? requestStatus.Pending"
              ></app-status-badge>
            </div>
          </div>
          <div class="request-time">
            <h4>{{ "Requested at" | translate }}</h4>
            <p>{{ model?.requestTime | customDateTime }}</p>
          </div>
          } @else if(isLoading) {
          <app-loading></app-loading>
          } @else if(!isLoading && !model){
          <app-no-result-found></app-no-result-found>
          }
        </div>
      </div>

      <div nz-col nzXs="24" nzSm="24" *ngIf="model?.requestLogs?.length! > 0">
        <div nz-flex nzVertical class="req-detail-card" nzGap="small">
          <div class="header-history">
            <h3>
              <nz-icon nzType="clock-circle" nzTheme="outline" />{{
                "Request Timeline" | translate
              }}
            </h3>
          </div>
          <nz-timeline class='timeline'>
            <nz-timeline-item
              *ngFor="let item of model?.requestLogs"
              [nzDot]="statusIconTpl"
            >
              <div nz-flex nzGap="small">
                <h4 style="font-weight: bold;">
                  <ng-container
                    *ngIf="
                      item.staffName && item.staffName !== '';
                      else noStaffName
                    "
                  >
                  {{"Responsible Staff" | translate}}:  {{ item.staffName }}
                  </ng-container>
                  <ng-template #noStaffName>
                    {{
                      translateService.currentLang === "en"
                        ? item.statusNameEn
                        : item.statusNameKh
                    }}
                  </ng-template>
                </h4>
                <span style="color: #b4b4b4;padding-left: 5px;">{{ item.createdDate | prettyDate:'yyyy-MM-dd h:mm a': translateService.currentLang    }}</span>
              
              </div>  

              <p>{{"Request Time" | translate}}: {{ item.createdDate | customDateTime}}</p> 
              <p *ngIf='item.note'>{{"Note" | translate}}: {{ item.note}}</p>
              <!-- Template for custom dot icon -->
              <ng-template #statusIconTpl>
                <img
                  style="border-radius: 4px; width: 20px; height: auto; margin-bottom: 4px;"
                  [src]="item.statusImage"
                  [alt]="item.statusNameEn"
                />
              </ng-template>
            </nz-timeline-item>
          </nz-timeline>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .timeline{
      margin-left: 12px;
    }
      .header-history {
        h3 {
          nz-icon { 
            margin-right: 12px;
          }
          font-weight: bold;
          font-size: 18px;
          margin-left: 8px;
        }
      }
      .req-detail-card {
        border-radius: 8px;
        position: relative;
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
}
