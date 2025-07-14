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
      [ngStyle]="{
        backgroundColor: getBadgeBgColor(status),
        color: getBadgeTextColor(status)
      }"
      class="badge"
      >@if(status == requestStatus.Pending){
      <nz-icon nzType="history" nzTheme="outline" />
      }@else if(status == requestStatus.InProgress){
      <nz-icon nzType="history" nzTheme="outline" />
      }@else if(status == requestStatus.Done){
      <nz-icon nzType="history" nzTheme="outline" />
      }@else if(status == requestStatus.Cancel){
      <nz-icon nzType="history" nzTheme="outline" />
      }
      {{ statusText }}
    </span>
  `,
    styleUrls: ["../../../assets/scss/list.style.scss"],
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
      .badge {
        padding: 2px 8px;
        border-radius: 8px;
        color: white;
        font-size: 11px;
      }
    `,
    ],
    standalone: false,
})
export class StatusBadgeComponent {
    @Input() status: RequestStatus = RequestStatus.Pending;
    @Input() statusText: string = '';

    readonly requestStatus = RequestStatus;

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

    getBadgeTextColor(status: number | undefined): string {
        switch (status) {
            case 1:
                return "#000000";
            case 2:
                return "#ffffff";
            case 3:
                return "#ffffff";
            case 4:
                return "#ffffff";
            default:
                return "#000000";
        }
    }
}
