import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { History } from "./history.service";

@Component({
    selector: "app-history",
    template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;">History</span>
      </button>
    </div>
    <div> 
        <h3 class="service-op-title">
        {{ "Your Requests" | translate }}
      </h3>
      <div nz-flex nzVertical nzGap="middle">
        <div *ngFor="let data of lists">
            <div nz-flex nzGap="middle">
              
                <div>
                    <h4>{{ data.requestTime }}</h4>
                    <p>{{ data.note }}</p>
                </div>
            </div>
        </div>
      </div>
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
export class HistoryComponent {
    isLoading = false;
    constructor(
        private location: Location,
        private router: Router
    ) { }

    goBack() {
        this.location.back();
    }
    lists: History[] = [
        {
            id: 1,
            requestTime: "2025-02-20T10:30:00.495653+07:00",
            guestId: 1,
            roomId: 1,
            stayId: 1,
            serviceItemId: 1,
            quantity: 2,
            status: 1,
            note: "",
            attachments: null,
        },
        {
            id: 2,
            requestTime: "2025-02-20T10:30:00.495653+07:00",
            guestId: 1,
            roomId: 1,
            stayId: 1,
            serviceItemId: 2,
            quantity: 2,
            status: 1,
            note: "",
            attachments: null,
        },
        {
            id: 3,
            requestTime: "2025-02-20T10:30:00.495653+07:00",
            guestId: 1,
            roomId: 1,
            stayId: 1,
            serviceItemId: 3,
            quantity: 2,
            status: 1,
            note: "",
            attachments: null,
        }
    ]



}
