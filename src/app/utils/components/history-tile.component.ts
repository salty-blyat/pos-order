import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Request, RequestStatus } from "../../pages/request/request.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-history-tile",
  template: `
    <div
      class="history-list shadow"
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
        <app-status-badge
          [img]="request?.statusImage!"
          [statusText]="
            translateService.currentLang == 'km'
              ? request?.statusNameKh!
              : request?.statusNameEn!
          "
          [status]="request?.status ?? requestStatus.Pending"
        ></app-status-badge>
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
        h3 {
          font-size: 14px;
          margin-bottom: 0px;
        }
        h5 {
          margin-bottom: 0px;
          font-size: 11px;
        }
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
        cursor: pointer;
        width: 100%;
        user-select: none;
        background-color: white;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
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
export class HistoryTileComponent {
  constructor(public translateService: TranslateService) {}
  @Input() request: Request | null = null;
  @Output() onClick = new EventEmitter<number>();
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
