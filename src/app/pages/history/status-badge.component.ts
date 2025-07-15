import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { Request, RequestStatus } from "../../pages/request/request.service";
@Component({
    selector: "app-status-badge",
    template: `
    <span
    nz-flex
    nzGap="small"
    class="badge"
    nzAlign="center"
      [ngStyle]="{  
        backgroundColor: getBadgeBgColor(status),
        color: getBadgeTextColor(status)
      }"> 
      <img [src]="img" [alt]="statusText" /> 
      {{ statusText }}
    </span>
  `,
    styleUrls: ["../../../assets/scss/list.style.scss"],
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
      .badge {
        width: fit-content;
        padding: 4px 8px;
        border-radius: 8px;
        color: white;
        font-size: 11px;
        text-wrap: nowrap;
        img{
            border-radius: 4px;width: 16px; height:auto;
        }
      }
    `,
    ],
    standalone: false,
})
export class StatusBadgeComponent {
    @Input() status: RequestStatus = RequestStatus.Pending;
    @Input() img: string = './../../../assets/image/noimg.jpg';
    @Input() statusText: string = '';

    readonly requestStatus = RequestStatus;

    getBadgeBgColor(status: number | undefined): string {
        switch (status) {
            case RequestStatus.Pending:
                return "#FBEFC9B5";
            case RequestStatus.InProgress:
                return "#7FC1FFBA";
            case RequestStatus.Done:
                return " #b0ffa5b8";
            case RequestStatus.Cancel:
                return "#f78a8a7d";
            default:
                return "#d9d9d9";
        }
    }
    getBadgeTextColor(status: number | undefined): string {
        switch (status) {
            case RequestStatus.Pending:
                return "#EEB600";
            case RequestStatus.InProgress:
                return "#009DDA";
            case RequestStatus.Done:
                return "#00B609";
            case RequestStatus.Cancel:
                return "#F90000B3";
            default:
                return "#000000";
        }
    }
}
