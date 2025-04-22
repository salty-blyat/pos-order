import { Component, OnInit } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { Room, RoomService } from "./room.service";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { RoomUiService } from "./room-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
    selector: "app-room-operation",
    template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }} {{ model?.roomNumber || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{ model?.roomNumber || ("Loading" | translate) }}</span>
    </div>

    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "RoomNumber" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="roomNumber" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "RoomType" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <app-room-type-select formControlName="roomTypeId" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Floor" | translate }}</nz-form-label>
            <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
              <app-floor-select formControlName="floorId" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "HouseKeepingStatus" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <app-lookup-item-select
              [lookupType]="LOOKUP_TYPE.HouseKeepingStatus"
              formControlName="houseKeepingStatus"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Status" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <app-lookup-item-select
              [lookupType]="LOOKUP_TYPE.Status"
              formControlName="status"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24">{{ "Tags" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
           <app-tag-multiple-select formControlName="tagIds"></app-tag-multiple-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24">{{ "Description" | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input type="text" formControlName="description" rows="3"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button nz-button nzType="primary" [disabled]="!frm.valid" (click)="onSubmit($event)">
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!loading && isRoomEdit">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isRoomEdit"></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isRoomRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isRoomRemove"></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
    styleUrls: ["../../../assets/scss/operation_page.scss"],
    standalone: false
})
export class RoomOperationComponent extends BaseOperationComponent<Room> {

  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomOperationComponent>,
    service: RoomService,
    uiService: RoomUiService
  ) {
    super(fb, ref, service, uiService);
  }

  lookupType = LOOKUP_TYPE;

  isRoomEdit: boolean = true;
  isRoomRemove: boolean = true;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override initControl(): void {
    const { required,nameExistValidator } = CommonValidators;
    this.frm = this.fb.group({
      roomNumber: [null, [required] ,[nameExistValidator(this.service, this.modal?.id, 'name')]],
      roomTypeId: [null, [required]],
      floorId: [null, [required]],
      houseKeepingStatus: [null, [required]],
      status: [null, [required]],
      tagIds: [null],
      description: [null],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      roomNumber: this.model.roomNumber,
      roomTypeId: this.model.roomTypeId,
      floorId: this.model.floorId,
      houseKeepingStatus: this.model.houseKeepingStatus,
      status: this.model.status,
      tagIds: this.model.tagIds,
      description: this.model.description,
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
