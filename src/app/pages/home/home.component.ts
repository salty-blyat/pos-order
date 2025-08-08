import {
  Component,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from "@angular/core";
import { HomeService, ServiceType } from "./home.service";
import { Router } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthService } from "../../helpers/auth.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { TranslateService } from "@ngx-translate/core";
import { QueryParam } from "../../utils/services/base-api.service";
@Component({
  selector: "app-home",
  template: `
    <div
      nz-flex
      nzJustify="space-between"
      class="card-container shadow"
      *ngIf="!isLoading() && guestName"
    >
      <div nz-flex nzVertical style="height:100%;">
        <span style="font-size:11px ; color: grey;">
          {{ "Welcome back" | translate }}
        </span>
        <strong style="font-size: 16px;"> {{ guestName }}</strong>
      </div>
      <div nz-flex nzVertical>
        <span style="font-size:12px ; color: grey; text-align:right"
          >{{ checkInDate | customDate }} -
          {{ checkOutDate | customDate }}</span
        >
        <span
          style="font-size: 16px;text-align:right"
          *ngIf="checkInDate"
          class="date-range"
          >{{ roomNo }} - {{ totalNight }} Nights
        </span>
      </div>
    </div>

    @if(isLoading()){
    <div style="position: relative;height:50vh;">
      <app-loading></app-loading>
    </div>
    } @else if( !isLoading() && lists().length === 0){
    <app-no-result-found></app-no-result-found>
    } @else if(!isLoading() && lists().length > 0){
    <div class="header-home">
      <h2>{{ ("How can we assist you today" | translate) + "?" }}</h2>
    </div>
    <div nz-row [nzGutter]="[8, 8]">
      <div
        nz-col
        nzXs="12"
        nzSm="8"
        nzLg="6"
        nzXL="6"
        *ngFor="let data of lists()"
      >
        <app-card
          [text]="data.name || ''"
          [id]="data.id || 0"
          [image]="data.image || ''"
          (onClick)="onClick($event)"
        ></app-card>
      </div>
    </div>

    }
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .header-home {
        margin-bottom: 8px;
        padding: 32px 0 0 0;
        text-wrap: balance;
        h2 {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .nights {
        color: #2e7d32;
        font-weight: 600;
      }
      .card-container {
        // max-width:370px;
        user-select: none;
        background-color: white;
        margin-left: 0 !important;
        padding: 18px 12px;
        border-radius: 8px;
        font-family: "Segoe UI", sans-serif;
        position: relative;
      }

      .avatar {
        width: 48px;
        height: 48px;
        background-color: #3f51b5;
        color: white;
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HomeComponent extends BaseListComponent<ServiceType> {
  constructor(
    override service: HomeService,
    sessionStorageService: SessionStorageService,
    private authService: AuthService,
    public router: Router
  ) {
    super(service, sessionStorageService, "service-type-list");
  }
  override param: WritableSignal<QueryParam> = signal({
    pageIndex: 1,
    pageSize: 99999,
    sorts: "",
    filters: "",
  });
  guestName: string = this.sessionStorageService.getValue("guestName") ?? "";
  roomNo: string = this.sessionStorageService.getValue("roomNo") ?? "";
  checkInDate: string =
    this.sessionStorageService.getValue("checkInDate") ?? "";
  checkOutDate: string =
    this.sessionStorageService.getValue("checkOutDate") ?? "";
  totalNight: string = this.sessionStorageService.getValue("totalNight") ?? "";
     
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}`]);
    }, 100);
  }
}
