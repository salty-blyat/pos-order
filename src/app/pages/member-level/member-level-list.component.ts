import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { MemberLevel, MemberLevelService } from "./member-level.service";
import { MemberLevelUiService } from "./member-level-ui.component";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SIZE_COLUMNS } from "../../const";

@Component({
  selector: "app-member-level-list",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header>
        <div nz-row>
          <div style="width: 220px; margin-right: 4px;">
            <app-filter-input
              storageKey="member-list-search"
              (filterChanged)="
                searchText.set($event); param().pageIndex = 1; search()
              "
            ></app-filter-input>
          </div>
          <div *ngIf="draged()">
            <button
              nz-button
              nzType="primary"
              (click)="saveOrdering()"
              [nzLoading]="isLoading()"
            >
              {{ "Save" | translate }}
            </button>
          </div>
        </div>
        <div>
          <button
            *ngIf="isMemberLevelAdd"
            nz-button
            nzType="primary"
            (click)="uiService.showAdd()"
          >
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
          nzHideOnSinglePage="true"
          (nzQueryParams)="onQueryParamsChange($event)"
        >
          <ng-template #noResult>
            <app-no-result-found></app-no-result-found>
          </ng-template>
          <thead>
            <tr>
              <th [nzWidth]="SIZE_COLUMNS.DRAG"></th>
              <th [nzWidth]="SIZE_COLUMNS.ID">#</th>
              <th [nzWidth]="SIZE_COLUMNS.NAME">{{ "Name" | translate }}</th>
              <th nzWidth="100px">{{ "LevelStay" | translate }}</th>
              <th>{{ "Note" | translate }}</th>
              <th [nzWidth]="SIZE_COLUMNS.ACTION"></th>
            </tr>
          </thead>
          <tbody
            cdkDropList cdkDropListLockAxis="y"
            (cdkDropListDropped)="drop($event)"
            [cdkDropListData]="lists()"
          >
            <tr *ngFor="let data of lists(); let i = index" cdkDrag>
              <td #bodyCell style=" cursor: move;" cdkDragHandle>
                <span nz-icon nzType="holder" nzTheme="outline"></span>
              </td>
              <td #bodyCell nzEllipsis>
                {{ i| rowNumber : { index: param().pageIndex || 0, size: param().pageSize || 0} }}
              </td>
              <td #bodyCell nzEllipsis title="{{ data.name }}">
                  <a (click)="uiService.showView(data.id!)">{{ data.name }}</a>
              </td>
              <td #bodyCell nzEllipsis title="{{ data.levelStay }}" nzAlign="center">
                {{ data.levelStay }}
              </td>
              <td #bodyCell nzEllipsis title="{{ data.note }}">
                {{ data.note }}
              </td>
              <td #bodyCell class="col-action">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <ng-container *ngIf="isMemberLevelEdit">
                    <a *nzSpaceItem (click)="uiService.showEdit(data.id || 0)">
                      <i nz-icon nzType="edit" nzTheme="outline"></i>
                      {{ "Edit" | translate }}
                    </a>
                  </ng-container>
                  <ng-container *ngIf="isMemberLevelRemove">
                    <a
                      *nzSpaceItem
                      (click)="uiService.showDelete(data.id || 0)"
                      nz-typography
                      style="color: #F31313"
                    >
                      <i nz-icon nzType="delete" nzTheme="outline"></i>
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
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  styles: [`
    .preview-row {
      display: table-row;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      width: 100%;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MemberLevelListComponent extends BaseListComponent<MemberLevel> implements AfterViewInit{
  constructor(
    service: MemberLevelService,
    uiService: MemberLevelUiService,
    sessionStorageService: SessionStorageService,
    private activated: ActivatedRoute
  ) {
    super(service, uiService, sessionStorageService, "member-level-list");
  }

  columnWidths: string[] = [];

  @ViewChildren('bodyCell', { read: ElementRef }) bodyCells!: QueryList<ElementRef>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.columnWidths = this.bodyCells.map((cell) =>
        `${(cell.nativeElement as HTMLElement).offsetWidth}px`
      );
      console.log(this.columnWidths)
    },500);
  }

  breadcrumbData = computed<Observable<any>>(() => this.activated.data);
  isMemberLevelAdd: boolean = true;
  isMemberLevelEdit: boolean = true;
  isMemberLevelRemove: boolean = true;
  isMemberLevelView: boolean = true;
  readonly SIZE_COLUMNS = SIZE_COLUMNS;
}
