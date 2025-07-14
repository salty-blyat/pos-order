import { Component, REQUEST, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Request, RequestService } from "../request/request.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Filter } from "../../utils/services/base-api.service";

@Component({
  selector: "app-history",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;">{{ "Back" | translate }}</span>
      </button>
    </div>
    <div class="header-history">
      <h3>
        {{ "Your Requests" | translate }}
      </h3>
      <div nz-flex nzVertical nzGap="middle">
        @if(isLoading()){
        <app-loading></app-loading>
        } @else if (!isLoading() && lists().length==0){
        <app-no-result-found></app-no-result-found> 
        } @else if (!isLoading() && lists().length>0){
        <div *ngFor="let data of lists()">
          <app-history-tile
            [request]="data"
            (onClick)="onClick(data.id || 0)"
          ></app-history-tile>
        </div>
        }
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .header-history {
        margin-bottom: 8px;
        text-wrap: balance;
        h3 {
          font-weight: bold;
        }
      }
      .history-list {
        width: 100%;
        background-color: white;
        border-radius: 8px;
        padding: 8px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
        }
      }
    `,
  ],
  standalone: false,
})
export class HistoryComponent extends BaseListComponent<Request> {
  constructor(
    service: RequestService,
    sessionStorageService: SessionStorageService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    super(service, sessionStorageService, "history-list");
  }

  protected override getCustomFilters(): Filter[] {
    const filter: Filter[] = [];
    if (this.sessionStorageService.getValue("guestId")) {
      filter.push({
        field: "guestId",
        operator: "eq",
        value: this.sessionStorageService.getValue("guestId"),
      });
    }
    return filter;
  }
  override ngOnInit(): void {
    if (this.sessionStorageService.getValue("guestId")) {
      this.search();
      console.log(this.lists());

    }
  }
  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/history/${id}`]);
    }, 100);
  }
  goBack() {
    this.location.back();
  }
}
