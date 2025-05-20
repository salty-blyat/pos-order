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
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}
  setting: Setting[] = [];
  urlPart = "/setting";
  setLastVisited(route: string) {
    this.localStorageService.setValue({
      key: SIDE_EXPAND_COLLAPSED,
      value: route,
    });
  }
  isMemberClassList = computed(() => true);
  isOfferGroupList = computed(() => true);
  isLookupList = computed(() => true);
  isCurrencyList = computed(() => true);
  isReportList = computed(() => true);
  isMemberLevelList = computed(() => true);
  isMemberUnitList = computed(() => true);
  isUnitList = computed(() => true);
  isAutoNumberList = computed(() => true);
  isBlockList = computed(() => true);
  isRoomTypeList = computed(() => true);
  isItemList = computed(() => true);
  isRoomCharge = computed(() => true);
  isChargeList = computed(() => true);
  isItemTypeList = computed(() => true);
  isMemberGroupList = computed(() => true);
  isTagsList = computed(() => true);
  isSystemSettingList = computed(() => true);
  isLocationList = computed(() => true);
  isBranchList = computed(() => true);
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
      {
        groupName: "Offer",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/offer-group`,
            label: "OfferGroup",
            isList: this.isOfferGroupList(),
          },
        ],
      },
      {
        groupName: "Member",
        subName: [
          {
            icon: "container",
            url: `${this.urlPart}/member-class`,
            label: "MemberClass",
            isList: this.isMemberClassList(),
          },
        ],
      },
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
