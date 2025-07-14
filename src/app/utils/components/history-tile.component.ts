import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Request, RequestStatus } from "../../pages/request/request.service";
@Component({
  selector: "app-history-tile",
  template: `
    <div
      class="history-list"
      nz-flex
      nzGap="middle"
      (click)="createRipple($event)"
    >
      <img
        [src]="request?.serviceItemImage || './../../../assets/image/noimg.jpg'"
        [alt]="request?.serviceItemName"
      />
      <div class="history-info">
        <h3>{{ request?.serviceItemName }}</h3>
        <h5 *ngIf="request?.quantity! > 0">
          {{ "Quantity" | translate }}: {{ request?.quantity }}
        </h5>

        <h5>{{ request?.requestTime | customDateTime }}</h5>
      </div>

      <div class="view-icon" nz-flex nzGap="small">
        <span
          [ngStyle]="{
            backgroundColor: getBadgeBgColor(request?.status),
            color: getBadgeTextColor(request?.status)
          }"
          class="badge"
          >@if(request?.status == requestStatus.Pending){
          <nz-icon nzType="history" nzTheme="outline" />
          }@else if(request?.status == requestStatus.InProgress){
          <nz-icon nzType="history" nzTheme="outline" />
          }@else if(request?.status == requestStatus.Done){
          <nz-icon nzType="history" nzTheme="outline" />
          }@else if(request?.status == requestStatus.Cancel){
          <nz-icon nzType="history" nzTheme="outline" />
          }

          {{ requestStatus[request?.status || 1] }}
        </span>
        <nz-icon nzType="right" nzTheme="outline" />
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .history-info {
        height: fit-content;
        margin: auto 0;
      }
      .badge {
        padding: 2px 8px;
        border-radius: 8px;
        color: white;
        font-size: 11px;
      }
      .view-icon {
        margin: auto 8px auto auto;
        font-size: 18px;
      }
      .header-history {
        margin-bottom: 8px;
        text-wrap: balance;
        h3 {
          font-weight: bold;
        }
      }
      .history-list {
        cursor:pointer;
        width: 100%;
        user-select:none; 
        background-color: white;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        padding: 8px;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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
export class HistoryTileComponent {
  @Input() request: Request | null = null;
  @Output() onClick = new EventEmitter<number>();
  readonly requestStatus = RequestStatus;

  getBadgeBgColor(status: number | undefined): string {
    switch (status) {
      case 1:
        return "#d9d9d9"; // Pending
      case 2:
        return "#1890ff"; // In Progress
      case 3:
        return "#52c41a"; // Done
      case 4:
        return "#f5222d"; // Cancel
      default:
        return "#d9d9d9"; // Fallback
    }
  }

  getBadgeTextColor(status: number | undefined): string {
    switch (status) {
      case 1:
        return "#000000"; // Pending
      case 2:
        return "#ffffff"; // In Progress
      case 3:
        return "#ffffff"; // Done
      case 4:
        return "#ffffff"; // Cancel
      default:
        return "#000000"; // Fallback
    }
  }

  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";

    ripple.style.left = event.clientX - rect.left - size / 2 + "px";
    ripple.style.top = event.clientY - rect.top - size / 2 + "px";

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    this.onClick.emit(this.request?.id);
  }
}
