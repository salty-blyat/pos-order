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
    <div class="card-container" *ngIf="!isLoading() && guestName" nz-row [nzGutter]="[8, 8]">
      <div  nz-col xs="24" sm="12">
        <div nz-flex nzGap="small" nzAlign="center">
          <div class="avatar">{{ avartar }}</div> 
          ✨
          <strong style="font-size: 16px;"
            >{{ "Welcome back" | translate }}, {{ guestName }}</strong
          >
          ✨
        </div>
      </div>

      <div nz-col xs="24" sm="12" class="room-details">
        <!-- NOTE: should i call to /stay/id  or should we include it in the 
         confirm endpoint or should we put it inside the guest endpoint -->
        <div class="room-number">{{ roomNo }} - Deluxe Suite</div>
        <div class="stay-info">
          <span class="nights">3 Nights</span><br />
          <span class="date-range">Dec 15, 2024 - Dec 18, 2024</span>
        </div>
      </div>
    </div>

    <div class="header-home">
      <h2>{{ "How can we assist you today" | translate }}?</h2>
    </div>
    @if(isLoading()){
      <div style="position: relative;height:50vh;"> 
        <app-loading></app-loading> 
      </div>
    } @else if( !isLoading() && lists().length === 0){ 
    <app-no-result-found></app-no-result-found>
    } @else if(!isLoading() && lists().length > 0){
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
        [text]="data.name  || ''"
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
      .room-details {
        font-size: 13px;
        font-weight: 400;
      }

      .room-number {
        font-weight: 600;
        color: #1e88e5;
      }

      .nights {
        color: #2e7d32;
        font-weight: 600;
      }

      .date-range {
        font-size: 12px;
        color: #888;
      }

      .card-container {
        display: flex;
        width: 100%;
        user-select: none;
        background-color: white;
        align-items: center;
        margin-left: 0 !important;
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        font-family: "Segoe UI", sans-serif;
        position: relative;
        // margin: 24px 8px 8px 8px !important;
        border-top: 3px solid #9c27b0; /* gradient illusion */
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
  avartar: string =
    this.guestName.trim().split(" ")[1].charAt(0).toUpperCase() +
    this.guestName.trim().split(" ")[1].charAt(1).toUpperCase();
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}`]);
    }, 100);
  }
}
