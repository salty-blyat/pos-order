import { Component, computed, OnInit, ViewEncapsulation } from "@angular/core";
import { AuthKeys, SIDE_EXPAND_COLLAPSED } from "../../const";
import { LocalStorageService } from "../../utils/services/localStorage.service";
import { AuthService } from "../../helpers/auth.service";

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
          <div nz-row class="content-container">
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
  constructor(private localStorageService: LocalStorageService, private authService: AuthService) { }
  setting: Setting[] = [];
  urlPart = "/setting";
  setLastVisited(route: string) {
    this.localStorageService.setValue({
      key: SIDE_EXPAND_COLLAPSED,
      value: route,
    });
  }

  isLookupList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__LOOKUP__LIST));
  isCurrencyList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__CURRENCY__LIST));
  isReportList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__REPORT__LIST));
  isMemberLevelList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__MEMBER_LEVEL__LIST));
  isMemberUnitList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__MEMBER_UNIT__LIST));
  isUnitList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__UNIT__LIST));
  isAutoNumberList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__AUTO_NUMBER__LIST));
  isBlockList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__BLOCK__LIST));
  isRoomTypeList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_TYPE__LIST));
  isItemList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM__LIST));
  isRoomCharge = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_CHARGE__LIST));
  isChargeList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__CHARGE__LIST));
  isItemTypeList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ITEM_TYPE__LIST));
  isMemberGroupList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__MEMBER_GROUP__LIST));
  isTagsList = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__TAG__LIST));
  isSystemSettingList = computed(() =>  
    this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__COMPANY_SETTING__VIEW) ||
    this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__AUTO_NUMBER__VIEW) ||
    this.authService.isAuthorized(AuthKeys.APP__SETTING__SYSTEM_SETTING__OTHER_APP__VIEW) 
  ); 
  isLocationList = computed(() => true );
  isBranchList = computed(() => true );
  ngOnInit(): void {
    this.setting = [
      {
        groupName: "GeneralSetting",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/lookup`,
            label: "Lookup",
            isList: this.isLookupList(),
          },
          {
            icon: "container",
            url: `${this.urlPart}/currency`,
            label: "Currency",
            isList: this.isCurrencyList(),
          }, 
        ],
      },
      // {
      //   groupName: "MemberUnit",
      //   subName: [
          
      //     {
      //       icon: "container",
      //       url: `${this.urlPart}/member-group`,
      //       label: "MemberGroup",
      //       isList: this.isMemberGroupList(),
      //     },
      //     {
      //       icon: "container",
      //       url: `${this.urlPart}/member-level`,
      //       label: "MemberLevel",
      //       isList: this.isMemberLevelList(),
      //     },
      //   ],
      // },
      {
        groupName: "Location",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/location`,
            label: "Location",
            isList: this.isLocationList(),
          },
          {
            icon: "container",
            url: `${this.urlPart}/branch`,
            label: "Branch",
            isList: this.isBranchList(),
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
            isList: this.isSystemSettingList(),
          },
          {
            icon: "container",
            url: `${this.urlPart}/auto-number`,
            label: "AutoNumber",
            isList: this.isAutoNumberList(),
          },
          {
            icon: "container",
            url: `${this.urlPart}/report`,
            label: "Report",
            isList: this.isReportList(),
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
