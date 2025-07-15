import { Component, signal, ViewEncapsulation } from "@angular/core";
import { HomeService, ServiceType } from "./home.service";
import { Router } from "@angular/router";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { AuthService } from "../../helpers/auth.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-home",
  template: `
    <div
      nz-flex
      nzJustify="space-between"
      class="card-container"
      *ngIf="!isLoading() && guestName"
    >
      <div nz-flex nzVertical style="height:100%;">
        <span style="font-size:12px ; color: grey;">
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
      <h2>{{ "How can we assist you today?" | translate }}</h2>
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
        width: 100%;
        user-select: none;
        background-color: white;
        margin-left: 0 !important;
        padding: 18px 12px;
        border-radius: 8px;
        box-shadow: 0 0px 6px rgba(0, 0, 0, 0.2);
        font-family: "Segoe UI", sans-serif;
        position: relative;
        // margin: 24px 8px 8px 8px !important;
        border-top: 3px solid #9c27b0;
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

  guestName: string = this.sessionStorageService.getValue("guestName") ?? "";
  roomNo: string = this.sessionStorageService.getValue("roomNo") ?? "";
  checkInDate: string =
    this.sessionStorageService.getValue("checkInDate") ?? "";
  checkOutDate: string =
    this.sessionStorageService.getValue("checkOutDate") ?? "";
  totalNight: string = this.sessionStorageService.getValue("totalNight") ?? "";
  avartar: string =
    this.guestName.trim().split(" ")[1].charAt(0).toUpperCase() +
    this.guestName.trim().split(" ")[1].charAt(1).toUpperCase();
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}`]);
    }, 100);
  }
}
