import {Component, computed, OnInit, signal} from '@angular/core';
import { BaseListComponent } from '../../utils/components/base-list.component';
import { TagGroup, TagGroupService } from './tag-group.service';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TagGroupUiService } from './tag-group-ui.service';
import { SIZE_COLUMNS } from '../../const';

@Component({
    selector: 'app-tag-group-list',
    template: `
    <nz-layout>
      <app-breadcrumb *ngIf="breadcrumbData()" [data]="breadcrumbData()"></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div>
            <app-filter-input
              storageKey="auto-number-list-search"
              (filterChanged)="searchText.set($event); param().pageIndex = 1; search()"
            >
            </app-filter-input>
          </div>
        </div>
        <div>
          <button *ngIf="isTagGroupAdd()" nz-button nzType="primary" (click)="uiService.showAdd()">
            <i nz-icon nzType="plus" nzTheme="outline"></i>{{ "Add" | translate }}
          </button>
        </div>
      </nz-header>
      <nz-content>
        <nz-table
          nzSize="small"
          nzShowSizeChanger
          #fixedTable
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
              <th class="col-header col-rowno">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="35%">{{ "Tags" | translate }}</th>
              <th >{{ "Note" | translate }}</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of lists(); let i = index">
              <td nzEllipsis>
                {{
                  i
                    | rowNumber
                      : {
                          index: param().pageIndex || 0,
                          size: param().pageSize || 0
                        }
                }}
              </td>
              <td nzEllipsis><a (click)="uiService.showView(data.id!)">{{ data.name }}</a></td>
              <td>
                <div class="show-tag" >
                  <nz-tag *ngFor="let tag of data.tags; let last = last">{{tag.name}}{{last ? '' : ' '}}</nz-tag>
                </div>
              </td>
              <td nzEllipsis>{{ data.note }}</td>
              
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isTagGroupEdit()">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline" style="padding-right: 5px"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isTagGroupRemove()">
                    <a *nzSpaceItem nz-typography style="color: #F31313" (click)="uiService.showDelete(data.id || 0)">
                      <i nz-icon nzType="delete" nzTheme="outline" style="padding-right: 5px"></i>
                      {{ "Delete" | translate }}
                    </a>
                  </ng-container>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-content>
    </nz-layout>
  `,
    styleUrls: ["../../../assets/scss/content_style.scss"],
    standalone: false
})
export class TagGroupListComponent extends BaseListComponent<TagGroup> {
  constructor(
    service: TagGroupService,
    uiService: TagGroupUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "tag-group-list");
  }
  breadcrumbData = computed<Observable<any>>(() => this.activated.data);

  isTagGroupAdd= signal<boolean>(true);
  isTagGroupEdit = signal<boolean>(true);
  isTagGroupRemove = signal<boolean>(true);
  isTagGroupView = signal<boolean>(true);
  
  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
