import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SIDE_EXPAND_COLLAPSED } from "../../const";
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
    <div class="content">
      <nz-layout>
        <nz-header>
          <div nz-row>
            <div class="setting-title">
              <i nzType="setting" nz-icon nzTheme="outline"></i>
              <span>{{ "Setting" | translate }}</span>
            </div>
          </div>
        </nz-header>
        <nz-content class="setting-content">
          <div nz-row>
            <ng-container *ngFor="let data of setting">
              <div *ngIf="isListGroup(data)">
                <div class="content-header">
                  <p nz-typography>{{ data.groupName | translate }}</p>
                </div>
                <ng-container *ngFor="let subData of data.subName">
                  <div class="content-body" *ngIf="subData.isList">
                    <a
                      routerLink="{{ subData.url }}"
                      (click)="setLastVisited(subData.url!)"
                    >
                      <i
                        nzType="{{ subData.icon }}"
                        nz-icon
                        nzTheme="outline"
                      ></i>
                      <span>{{ subData.label | translate }}</span>
                    </a>
                  </div>
                </ng-container>
              </div>
            </ng-container>
          </div>
        </nz-content>
      </nz-layout>
    </div>
  `,
  styleUrls: ["../../../assets/scss/setting.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class SettingComponent implements OnInit {
  constructor(private localStorageService: LocalStorageService) {}
  setting: Setting[] = [];
  urlPart = "/setting";
  setLastVisited(route: string) {
    this.localStorageService.setValue({
      key: SIDE_EXPAND_COLLAPSED,
      value: route,
    });
  }

  isLookupList: boolean = true;
  isCurrencyList: boolean = true;
  isReportList: boolean = true;
  isMemberLevelList: boolean = true;
  isMemberUnitList: boolean = true;
  isUnitList: boolean = true;
  isSystemSettingList: boolean = true;
  isAutoNumberList: boolean = true;
  isBlockList: boolean = true;
  isRoomTypeList: boolean = true;
  isItemList: boolean = true; 
  isRoomChargeType : boolean = true;
  isCharge : boolean = true;
  isItemTypeList: boolean = true;
  isMemberGroupList: boolean = true;
  ngOnInit(): void {
    this.setting = [
      {
        groupName: "GeneralSetting",
        subName: [
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
            url: `${this.urlPart}/unit`,
            label: "Unit",
            isList: this.isUnitList,
          },

        ],
      },
      {
        groupName: "MemberUnit",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/member-unit`,
            label: "MemberUnit",
            isList: this.isMemberUnitList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/member-group`,
            label: "MemberGroup",
            isList: this.isMemberGroupList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/member-level`,
            label: "MemberLevel",
            isList: this.isMemberLevelList,
          },
        ],
      },
      {
        groupName: "Block",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/block`,
            label: "Block",
            isList: this.isBlockList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/room-type`,
            label: "RoomType",
            isList: this.isRoomTypeList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/item-type`,
            label: "ItemType",
            isList: this.isItemTypeList,
          },
          {
            icon: "container",
            url: `${this.urlPart}/item`,
            label: "Item",
            isList: this.isItemList,
          },
        ],
      },
      {
        groupName: "Charge",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/room-charge-type`,
            label: "RoomChargeType",
            isList: this.isRoomChargeType,
          }, 
          
          {
            icon: "container",
            url: `${this.urlPart}/charge`,
            label: "Charge",
            isList: this.isCharge,
          }, 
        ]},
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
    return (
      data.subName?.filter((item: { isList: any }) => item.isList).length > 0
    );
  }
}
