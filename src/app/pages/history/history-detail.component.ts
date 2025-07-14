import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Request, RequestService } from "../request/request.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subscription } from "rxjs";


@Component({
  selector: "app-history-detail",
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
       
    </div>
    `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
     `,
  ],
  standalone: false,
})
export class HistoryDetailComponent implements OnInit {
  constructor(private location: Location, private requestService: RequestService, private router: Router, private activatedRoute: ActivatedRoute) { }
  isLoading: boolean = false;
  refresher = new Subscription();
  routeRefresher = new Subscription();
  ngOnInit(): void {
    // this.routeRefresher = this.activatedRoute.params.subscribe((params) => {
    //     this.isLoading = true;
    //     this.requestService.getRequestById(params.id).subscribe((res) => {
    //         this.isLoading = false;
    //         this.lists = res;
    //     });
    // });
  }
  goBack() {
    this.location.back();
  }
  // lists: Request = {
  //   id: 1,
  //   requestTime: "2025-02-20T10:30:00.495653+07:00",
  //   guestId: 1,
  //   roomId: 1,
  //   stayId: 1,
  //   serviceItemId: 1,
  //   serviceName: "Service 1",
  //   serviceItemName: "Service Item 1",
  //   quantity: 2,
  //   status: 1,
  //   note: "Note",
  //   // serviceImage: "./../../../assets/image/noimg.jpg",
  //   attachments: []
  // };
}
