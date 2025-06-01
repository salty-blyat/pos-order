import {
  Component,
  computed,
  forwardRef,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { AuthService } from "../../helpers/auth.service";
import { MemberClass, MemberClassService } from "./member-class.service";
import { MemberClassUiService } from "./member-class-ui.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MemberClassSelectComponent),
      multi: true,
    },
  ],
  selector: "app-member-class-select",
  template: `
    <nz-select
      class="offer-select"
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
    >
      <nz-option
        *ngIf="showAllOption()"
        [nzValue]="0"
        [nzLabel]="'AllMemberClass' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item?.id"
        [nzLabel]="item?.name!"
      >
        <div class="b-name  option-container " nz-flex nzGap="small">
          <div class="image-container">
            <img *ngIf="item.photo" [src]="item.photo" alt="" />
            <img
              *ngIf="!item.photo"
              src="./assets/image/img-not-found.jpg"
              alt=""
            />
          </div>
          <span>{{ item.name }}</span>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isMemberClassAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,

  styles: [
    `
      nz-select {
        width: 100%;
      }
      .item-action {
        flex: 0 0 auto;
        padding: 6px 8px;
        display: block;
      }

      .option-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .image {
        padding: 0 !important;
      }

      .image-list {
        height: 38px;
        object-fit: scale-down;
      }

      .option-text {
        font-size: 14px;
      }
     
      .image-container {
        height: 18px;  
      }

      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MemberClassSelectComponent extends BaseSelectComponent<MemberClass> {
  constructor(
    service: MemberClassService,
    override uiService: MemberClassUiService,
    private authService: AuthService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "member-class-filter",
      "all-member-class"
    );
  }
  isMemberClassAdd = signal<boolean>(true);
}
