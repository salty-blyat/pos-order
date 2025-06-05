import {
  Component,
  computed,
  forwardRef, input, signal,
  ViewEncapsulation
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { Member, MemberService } from "./member.service";
import { MemberUiService } from "./member-ui.service";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { QueryParam } from "../../utils/services/base-api.service";
import { AuthKeys } from "../../const";
import { AuthService } from "../../helpers/auth.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MemberSelectComponent),
      multi: true,
    },
  ],
  selector: "app-member-select",
  template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [nzOptionHeightPx]="50"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzScrollToBottom)="loadMoreOption() ? searchMore() : null"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
    >
      <nz-option
        *ngIf="showAllOption()"
        [nzValue]="0"
        [nzLabel]="'AllMember' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item?.name + ''"
      >
        <div nz-flex nzAlign="center" nzGap="small">
          <nz-avatar nzIcon="user" [nzSrc]="item.photo"></nz-avatar>
          <div class="container">
            <span class="title">
             {{ item.code }} {{ item.name }}
            </span>
            <div *ngIf="item.latinName || item.phone" class="subtitle">
              <span *ngIf="item.latinName">
                {{ item.latinName }}
              </span> <br *ngIf="item.latinName" />
              <span *ngIf="item.phone">
                {{ item.phone }}
              </span>
            </div>
          </div>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <nz-spin *ngIf="isLoading() && loadMoreOption()"></nz-spin>
        <a
          *ngIf="addOption() && isMemberAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,
  standalone: false,
  styles: [
    `
      :host .ant-select-item {
        line-height: 14px !important;
      }
      nz-select {
        width: 100%;
      }
      .item-action {
        flex: 0 0 auto;
        padding: 6px 8px;
        display: block;
      }
      .b-code {
        font-weight: bolder;
      }
      .container {
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        .title {
          display: flex;
          gap: 2px;
          font-size: 12px;
          line-height: 1.6;
        }
        .subtitle {
          font-size: 10px;
          line-height: 1.1;
          color: #6f6f6f;
        }
      }
      ::ng-deep cdk-virtual-scroll-viewport {
        min-height: 34px;
      }
    `,
  ],

  encapsulation: ViewEncapsulation.None,
})
export class MemberSelectComponent extends BaseSelectComponent<Member> {
  constructor(
    service: MemberService,
    uiService: MemberUiService,
    private authService: AuthService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "member-filter",
      "all-member"
    );
  }
  override writeValue(value: number | null): void {
    this.selected.set(value ?? 0);
    this.onChangeCallback(value);
    this.onTouchedCallback();

    if (value && typeof value === "number") {
      this.isLoading.set(true);
      this.service.find(value).subscribe({
        next: (entity) => {
          if (!this.lists().some((item) => item.id === entity.id)) {
            this.lists.update((list) => [entity, ...list]);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  override param = signal<QueryParam>({
    pageSize: 10,
    pageIndex: 1,
    sorts: "",
    filters: "",
  });

  isMemberAdd = computed<boolean>(() =>
    this.authService.isAuthorized(AuthKeys.APP__MEMBER__ADD)
  );
  override ngOnDestroy(): void {
    if (this.refreshSub$) {
      this.refreshSub$.unsubscribe();
    }
  }
}
