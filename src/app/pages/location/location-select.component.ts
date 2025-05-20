import {
    Component,
    forwardRef,
    signal,
    ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Location, LocationService } from "./location.service";
import { LocationUiService } from "./location-ui.service";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LocationSelectComponent),
            multi: true,
        },
    ],
    selector: "app-location-select",
    template: `
      <nz-select
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
          [nzLabel]="'AllLocation' | translate"
        ></nz-option>
        <nz-option
          *ngFor="let item of lists()"
          nzCustomContent
          [nzValue]="item.id"
          [nzLabel]="item?.name + ''"
        >
          <div nz-flex nzAlign="center" nzGap="small">
            <!-- <nz-avatar [nzSrc]="item.image"></nz-avatar>  -->
              <span class="b-name"> {{ item.name }} </span> 
          </div>
        </nz-option>
        <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
          <i nz-icon nzType="loading" class="loading-icon"></i>
          {{ "Loading" | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption() && isLocationAdd()"
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
        .b-name {
          font-size: 12px;
          padding-left: 5px;
        }
        ::ng-deep cdk-virtual-scroll-viewport {
          min-height: 34px;
        }
      `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class LocationSelectComponent extends BaseSelectComponent<Location> {
    constructor(
        service: LocationService,
        uiService: LocationUiService,
        sessionStorageService: SessionStorageService
    ) {
        super(
            service,
            uiService,
            sessionStorageService,
            "location-filter",
            "all-location"
        );
    }

    isLocationAdd = signal<boolean>(true);
}
