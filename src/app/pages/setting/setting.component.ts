import { Component, OnInit } from "@angular/core";
import { SIDE_EXPAND_COLLAPSED } from "../../const";
import { AuthService } from "../../helpers/auth.service";
import { LocalStorageService } from "../../utils/services/localStorage.service";

interface SubName {
  icon?: string;
  url?: string;
  label: string;
  isList?: boolean;
}

interface Setting {
  groupName: string;
  subName: SubName[];
}

@Component({
    selector: "app-setting",
    template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div>
            <i nzType="setting" nz-icon nzTheme="outline"></i>
            <span>{{ "Setting" | translate }}</span>
          </div>
        </div>
      </nz-header>
      <nz-content>
        <div nz-row>
          <ng-container *ngFor="let data of setting">
            <div nz-col [nzXs]="6" *ngIf="isListGroup(data)">
              <div class="content-header">
                <p nz-typography>{{ data.groupName | translate }}</p>
              </div>
              <ng-container *ngFor="let subData of data.subName">
                <div class="content-body" *ngIf="subData.isList">
                  <a routerLink="{{ subData.url }}" (click)="setLastVisited(subData.url!)">
                    <i nzType="{{ subData.icon }}" nz-icon nzTheme="outline"></i>
                    <span>{{ subData.label | translate }}</span>
                  </a>
                </div>
              </ng-container>
            </div>
          </ng-container>
        </div>
      </nz-content>
    </nz-layout>
  `,
    styleUrls: ["../../../assets/scss/setting-style.scss"],
    standalone: false
})
export class SettingComponent implements OnInit {
  constructor(private localStorageService: LocalStorageService, private authService: AuthService) {}
  setting: Setting[] = [];
  urlPart = "/setting";
  setLastVisited(route: string) {
    this.localStorageService.setValue({
      key: SIDE_EXPAND_COLLAPSED,
      value: route,
    });
  }

  isBranchList: boolean = true;
  isLookupList: boolean = true;
  isCurrencyList: boolean = true;
  isReportList: boolean = true;
  isSystemSettingList: boolean = true;
  isAutoNumberList: boolean = true;
  isBlockList: boolean = true;
  isRoomTypeList: boolean = true;
  isRoomList: boolean = true;
  isAmenityGroup: boolean = true;
  isTagGroup: boolean = true;
  isStaffList: boolean = true;
  isHousekeepingList:boolean = true;
  isRateOptionList:boolean = true;
  isCancelPolicyList:boolean = true;
  ngOnInit(): void {
    this.setting = [
      {
        groupName: "GeneralSetting",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/branch`,
            label: "Branch",
            isList: this.isBranchList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/lookup`,
            label: "Lookup",
            isList: this.isLookupList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/currency`,
            label: "Currency",
            isList: this.isCurrencyList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/amenity-group`,
            label: "Asset",
            isList: this.isAmenityGroup,
          },
          {
            icon: "container",
            url: `${this.urlPart}/tag-group`,
            label: "TagGroup",
            isList: this.isTagGroup,
          },
        ],
      },
      {
        groupName: "Room",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/room-type`,
            label: "RoomType",
            isList: this.isRoomTypeList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/room`,
            label: "Room",
            isList: this.isRoomList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/block`,
            label: "Block",
            isList: this.isBlockList,
          },
          
        ],
      },
      {
        groupName: "SystemSetting",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/system-setting`,
            label: "SystemSetting",
            isList: this.isSystemSettingList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/auto-number`,
            label: "AutoNumber",
            isList: this.isAutoNumberList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/report`,
            label: "Report",
            isList: this.isReportList,
          },
        ],
      },
      
    ];
  }

  isListGroup(data: any): boolean {
    return data.subName?.filter((item: { isList: any }) => item.isList).length > 0;
  }
}
