import {Component, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { Tag, TagGroup, TagGroupService } from "./tag-group.service";
import { FormArray, FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { TagGroupUiService } from "./tag-group-ui.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonValidators } from "../../utils/services/common-validators";

@Component({
  selector: "app-tag-group-operation",
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView"
          >{{ "Edit" | translate }} {{ model?.name || ("Loading" | translate) }}</span
          >
          <span *ngIf="modal?.id && modal?.isView">{{ model?.name || ("Loading" | translate) }}</span>
      </div>

      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips" class="form-content">
              <nz-tabset style="height:100%">
                  <nz-tab [nzTitle]="tagGroup">
                      <ng-template #tagGroup><span nz-icon nzType="file-done"></span> {{ "General" | translate }}
                      </ng-template>
                      <nz-form-item style="margin-top: 10px !important;">
                          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Name" | translate }}</nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                              <input nz-input formControlName="name"/>
                          </nz-form-control>
                      </nz-form-item>
                      <nz-form-item>
                          <nz-form-label [nzSm]="7" [nzXs]="24">
                              {{ "Note" | translate }}
                          </nz-form-label>
                          <nz-form-control [nzSm]="14" [nzXs]="24">
                              <textarea nz-input type="text" formControlName="note" rows="3"></textarea>
                          </nz-form-control>
                      </nz-form-item>
                  </nz-tab>

                  <nz-tab [nzTitle]="tag">
                      <ng-template #tag>
                          <span nz-icon nzType="tag"></span> {{ "Tag" | translate }}
                      </ng-template>
                      <div #scrollable nz-row class="table-form">
                          <nz-table
                                  nzSize="small"
                                  nzTableLayout="fixed"
                                  #fixedTable
                                  [nzData]="tags.controls"
                                  [nzNoResult]="' '"
                                  [nzFrontPagination]="false"
                          >
                              <thead>
                              <tr class="table-form-thead">
                                  <th class="col-header" nzWidth="5%"></th>
                                  <th class="col-header" nzWidth="5%" style="padding:0;">#</th>
                                  <th class="col-header" nzWidth="30%">
                                      {{ "Name" | translate }}
                                  </th>
                                  <th class="col-header" nzWidth="40%">
                                      {{ "Note" | translate }}
                                  </th>
                                  <th class="col-header" nzWidth="5%"></th>
                              </tr>
                              </thead>
                              <tbody cdkDropListLockAxis="y" formArrayName="tags" cdkDropList (cdkDropListDropped)="onDropped($event)">
                              <ng-container *ngFor="let item of tags?.controls; let i = index">
                                  <tr [formGroupName]="i" cdkDrag cdkDragLockAxis="y"
                                      [cdkDragDisabled]="this.modal?.isView">
                                      <td class="move" cdkDragHandle>
                                          <span nz-icon nzType="holder" nzTheme="outline"></span>
                                      </td>
                                      <td>
                                          <nz-form-item style="margin-bottom: 0 !important">
                                              <nz-form-control>
                                                  <span>{{ i + 1 }}</span>
                                              </nz-form-control>
                                          </nz-form-item>
                                      </td>
                                      <td>
                                          <nz-form-item style="margin: 0 !important; ">
                                              <nz-form-control [nzSm]="24" [nzXs]="24">
                                                  <input nz-input formControlName="name" style="width:100%;"/>
                                              </nz-form-control>
                                          </nz-form-item>
                                      </td>
                                      <td>
                                          <nz-form-item style="margin: 0 !important; ">
                                              <nz-form-control [nzSm]="24" [nzXs]="24">
                                                  <input nz-input formControlName="note" style="width:100%; "/>
                                              </nz-form-control>
                                          </nz-form-item>
                                      </td>

                                      <td>
                                          <a nz-button nzType="link" nzDanger (click)="removeTag(i)" style="padding:0;"
                                             [disabled]="modal?.isView">
                                              <i nz-icon nzType="delete" nzTheme="outline"></i>
                                          </a>
                                      </td>
                                  </tr>
                              </ng-container>
                              </tbody>
                          </nz-table>
                      </div>
                      <div nz-row>
                          <button
                                  nz-button
                                  nzBlock
                                  type="button"
                                  nzType="link"
                                  [nzSize]="'large'"
                                  class="btn-add-row"
                                  (click)="addTag(); scrollToBottom()"
                                  [disabled]="modal?.isView"
                          >
                              <i nz-icon nzTheme="outline" nzType="plus"></i>
                              {{ "Add" | translate }}
                          </button>
                      </div>
                  </nz-tab>
              </nz-tabset>
          </form>
      </div>
      <div *nzModalFooter>
          <div *ngIf="!modal?.isView">
              <button nz-button nzType="primary" [disabled]="!frm.valid" (click)="onSubmit($event)">
                  <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
                  {{ "Save" | translate }}
              </button>
              <button nz-button nzType="default" (click)="cancel()">
                  {{ "Cancel" | translate }}
              </button>
          </div>
          <div *ngIf="modal?.isView">
              <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!isLoading() && isTagGroupEdit">
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isTagGroupEdit"></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading() && isTagGroupRemove"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isTagGroupRemove"></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Close" | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [
    `
      .ant-tabs-tab {
        margin-left: 10px !important;
        padding: 8px 0;
        margin-bottom: 0;
      }

      .ant-tabs-top > .ant-tabs-nav {
        margin-bottom: 10px;
      }

      nz-table {
        width: 100%;
        min-height: 0 !important;
      }

      .cdk-drag-preview {
        display: table;
        width: 100%;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 5px;
        border-radius: 4px;
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .ant-tabs-content-holder {
        display: flex;
      }

      .ant-tabs-tabpane {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

    .modal-content {
      height: 100%;
      overflow: hidden;
    }

    .form-content {
      height: 100%;
      padding: 0;
    }

    .table-form {
      overflow-y: auto;

      &-thead {
        position: sticky;
        z-index: 200;
        top: 0;
      }

      td {
        padding: 2px !important;
      }

    }

    .move {
      cursor: move;
      width: 3%;
      text-align: center;
      vertical-align: middle;
    }
    
    .btn-add-row {
      font-weight: bold;
      font-size: 14px;
      border-bottom: 1px solid #f0f0f0 !important;
      height: 36px;
    }
    .btn-add-row:hover {
      border-bottom: 1px solid #f0f0f0;
    }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class TagGroupOperationComponent extends BaseOperationComponent<TagGroup> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<TagGroupOperationComponent>,
    service: TagGroupService,
    uiService: TagGroupUiService
  ) {
    super(fb, ref, service, uiService);
  }

  @ViewChild("scrollable") tableForm: any;
  @Input() id = 0;

  isTagGroupEdit: boolean = true;
  isTagGroupRemove: boolean = true;

  override initControl() {
    const { required,
      nameMaxLengthValidator,
      nameExistValidator, } = CommonValidators;
    this.frm = this.fb.group({
      name: [null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null],
      tags: this.fb.array([]),
    });
  }

  initTagControl(tag?: Tag) {
    const { required } = CommonValidators;
    this.tags.push(
      this.fb.group({
        id: [tag?.id ?? 0],
        name: [tag?.name, [required]],
        note: [tag?.note],
        ordering: [this.tags.length + 1],
        groupId: [tag?.groupId ?? 0],
      })
    );
  }

  override setFormValue() {
    this.tags.clear();
    this.frm.patchValue({
      name: this.model.name,
      note: this.model.note,
    });
    this.model.tags?.forEach((tag) => {
      this.initTagControl(tag);
    });

    if (this.modal?.isView) {
      this.frm.disable();
    }
  }
  get tags() {
    return this.frm.get("tags") as FormArray;
  }

  addTag() {
    this.initTagControl();
  }

  onDropped(event: CdkDragDrop<Array<any>>): void {
    moveItemInArray(this.tags.controls, event.previousIndex, event.currentIndex);

    this.tags.controls.forEach((control, index) => {
      control.get("ordering")?.setValue(index + 1);
    });
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const element = this.tableForm.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
}
