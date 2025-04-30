import {
  Component,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { MemberUnit, MemberUnitService } from "./member-unit.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Summary } from "../../utils/services/base-api.service";

@Component({
  selector: "app-member-unit-pull",
  template: `
    <div *nzModalTitle>
      <span>{{ "MemberUnit" | translate }}</span>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <a>
        <i nz-icon nzType="exclamation-circle" nzTheme="outline"></i>
      </a>
      <span>{{ "PullMembersUnit" | translate }} !</span>
      <ng-template #notificationTemp>
        <div class="ant-notification-notice-content">
          <div class="ant-notification-notice-with-icon">
            <span class="ant-notification-notice-icon">
              <span
                nz-icon
                nzType="check-circle"
                style="color: #52c41a;"
              ></span>
            </span>
            <div class="ant-notification-notice-message">
              {{ "PullSuccessfully" | translate }}
            </div>
            <div class="ant-notification-notice-description">
              @if (summary.totalUpdated) {
              <span>
                {{ "TotalUpdated" | translate }}
                <b>{{ summary.totalUpdated }}</b>
              </span>
              } @if (summary.totalInserted) {
              <span>
                {{ "TotalInserted" | translate }}
                <b>{{ summary.totalInserted }}</b>
              </span>
              }
            </div>
          </div>
        </div>
      </ng-template>
    </div>

    <div *nzModalFooter>
      <button
        nz-button
        [disabled]="isLoading()"
        nzType="primary"
        (click)="onSubmit($event)"
      >
        <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
        {{ "Pull" | translate }}
      </button>
      <button nz-button nzType="default" (click)="cancel()">
        {{ "Cancel" | translate }}
      </button>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class MemberUnitPullComponent {
  constructor(
    public ref: NzModalRef<MemberUnitPullComponent>,
    private service: MemberUnitService,
    private notification: NzNotificationService
  ) {}

  @ViewChild("notificationTemp") notificationTemp!: TemplateRef<any>;
  isLoading = signal<boolean>(false);
  model: MemberUnit = {};
  summary: Summary = {};

  cancel() {
    this.ref.triggerCancel().then();
  }

  onSubmit(e: MouseEvent) {
    if (e.detail === 1 || e.detail === 0) {
      this.isLoading.set(true);
      this.service.pull().subscribe({
        next: (result: { results: MemberUnit[]; summary: Summary }) => {
          this.notification.template(this.notificationTemp);
          this.summary = result.summary;
          this.ref.triggerOk().then();
          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading.set(false);
        },
      });
    }
  }
}
