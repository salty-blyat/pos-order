import {
  Component,
  HostListener,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Request, RequestService } from "../request/request.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Filter, QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-history",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;">{{ "Back" | translate }}</span>
      </button>
    </div>
    <div class="header-history" style="position:relative; " >
      <div   nz-flex nzAlign='end' style="position:sticky; top:56px; z-index:1;padding-bottom: 8px; background-color:#f0f6ff;height: 45px;">
        <h3 >
          {{ "Your Requests" | translate }}
        </h3>
      </div>
   
      <div nz-flex nzVertical nzGap="middle"> 
        <ng-container *ngIf="isLoading()">
        <app-loading></app-loading>
        </ng-container>
        <ng-container *ngIf="!isLoading() && lists().length == 0">
        <app-no-result-found></app-no-result-found>
        </ng-container>
        <ng-container *ngIf="lists().length > 0">
        <div *ngFor="let data of lists() ">
          <app-history-tile
            [request]="data"
            (onClick)="onClick(data.id || 0)"
          ></app-history-tile>
        </div>
        </ng-container>
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
        position:relative;
        h3 {
          font-weight: bold;
          margin-bottom:0;
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
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (scrollTop + windowHeight + 50 >= docHeight) {
      this.onBottomReached();
    }
  }

  onBottomReached() {
    this.loadMoreOption.set(true)
    this.searchMore();
  }

  override param: WritableSignal<QueryParam> = signal({
    pageIndex: 1,
    pageSize: 25,
    sorts: "-requestTime",
    filters: "",
  });

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
    }
    // this.loadMoreOption.set(true)
    // this.searchMore();
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
