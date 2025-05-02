import {Component, input, signal, ViewEncapsulation} from "@angular/core";
import {SIZE_COLUMNS} from "../../const";
import {BaseListComponent} from "../../utils/components/base-list.component";
import {RoomMember, RoomMemberService} from "./room-member.service";
import {RoomMemberUiService} from "./room-member-ui.service";
import {SessionStorageService} from "../../utils/services/sessionStorage.service";

@Component({
  selector: 'app-room-member-list',
  template: `
      <nz-layout>
          <nz-header>
              <div nz-row>
                  <div nz-col>
                      <app-date-range-input
                              storageKey="room-member-filter-date"
                              (valueChanged)="joinedDate.set($event); param().pageIndex = 1; search()"
                      ></app-date-range-input>
                  </div>
                  <div nz-col>
                      <app-member-select
                              [showAllOption]="true"
                              storageKey="room-member-filter-member"
                              (valueChanged)="memberId.set($event); param().pageIndex = 1; search()"
                      ></app-member-select>
                  </div>
              </div>
              <div style="margin-left:auto">
                  <button nz-button nzType="primary" (click)="uiService.showAdd(roomId())">
                      <i nz-icon nzType="plus" nzTheme="outline"></i>
                      {{ "Add" | translate }}
                  </button>
              </div>
          </nz-header>
          <nz-content>
              <nz-table
                      nzSize="small"
                      nzShowSizeChanger
                      nzTableLayout="fixed"
                      [nzPageSizeOptions]="pageSizeOption()"
                      [nzData]="lists()"
                      [nzLoading]="isLoading()"
                      [nzTotal]="param().rowCount || 0"
                      [nzPageSize]="param().pageSize || 0"
                      [nzPageIndex]="param().pageIndex || 0"
                      [nzNoResult]="noResult"
                      [nzFrontPagination]="false"
                      (nzQueryParams)="onQueryParamsChange($event)"
              >
                  <ng-template #noResult>
                      <app-no-result-found></app-no-result-found>
                  </ng-template>
                  <thead>
                  <tr>
                      <th nzEllipsis [nzWidth]="SIZE_COLUMNS.ID">#</th>
                      <th nzEllipsis [nzWidth]="SIZE_COLUMNS.NAME">{{ "Member" | translate }}</th>
                      <th nzEllipsis nzWidth="240px">{{ "JoinedDate" | translate }}</th>
                      <th nzEllipsis >{{ "Note" | translate }}</th>
                      <th nzEllipsis nzWidth="40px"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let data of lists(); let i = index">
                      <td nzEllipsis>
                          {{ i | rowNumber: {index: param().pageIndex || 0, size: param().pageSize || 0} }}
                      </td>
                      <td nzEllipsis>{{ data.memberName }}</td>
                      <td nzEllipsis>{{ data.joinedDate | customDate }}</td>
                      <td nzEllipsis>  {{ data.note }}  </td>
                      <td class="col-action">
                          <a [nzDropdownMenu]="menu"
                             class="action-button menu-dropdown"
                             nz-dropdown
                             nzTrigger="click"
                             nzPlacement="bottomRight">
                              <i nz-icon
                                 nzType="ellipsis"
                                 nzTheme="outline"
                                 style="font-size: 22px"></i>
                          </a>
                          <nz-dropdown-menu #menu="nzDropdownMenu">
                              <ul nz-menu class="dropdown-menu-custom">
                                  <li class="menu-item edit"
                                      nz-menu-item
                                      (click)="uiService.showEdit(data.id!)">
                              <span>
                                <i nz-icon nzType="edit"></i>&nbsp;
                                <span class="action-text">{{ "Edit" | translate }}</span>
                              </span>
                                  </li>
                                  <li class="menu-item delete"
                                      nz-menu-item
                                      (click)="uiService.showDelete(data.id!)">
                              <span>
                                <i nz-icon nzType="delete"></i>&nbsp;
                                <span class="action-text">{{ "Delete" | translate }}</span>
                              </span>
                                  </li>
                              </ul>
                          </nz-dropdown-menu>
                      </td>
                  </tr>
                  </tbody>
              </nz-table>
          </nz-content>
      </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})


export class RoomMemberListComponent extends BaseListComponent<RoomMember>{
  constructor(
    service: RoomMemberService,
    uiService: RoomMemberUiService,
    sessionStorageService: SessionStorageService,
  ) {
    super(service, uiService, sessionStorageService, "room-member-list");
  }

  memberId = signal<number>(0);
  roomId = input<number>(0);
  joinedDate = signal<Date[]>([new Date(), new Date()]);

  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}