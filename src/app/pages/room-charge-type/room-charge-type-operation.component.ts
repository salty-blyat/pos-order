import { Component, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import {
  RoomChargeType,
  RoomChargeTypeService,
} from "./room-charge-type.service";
import { RoomChargeTypeUiService } from "./room-charge-type-ui.service";

@Component({
  selector: "app-room-charge-type-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView">
        {{ "Edit" | translate }}
        {{ model?.roomNumber || ("Loading" | translate) }}
      </span>
      <span *ngIf="modal?.id && modal?.isView">
        {{ model?.roomNumber || ("Loading" | translate) }}
      </span>
    </div>

    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
       
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "RoomNumber" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="roomNumber" />
          </nz-form-control>
        </nz-form-item> 

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24">{{
            "Note" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea
              nz-input
              type="text"
              formControlName="note"
              rows="3"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid"
          (click)="onSubmit($event)"
        >
          <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!isLoading() && isRoomChargeTypeEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomChargeTypeEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isRoomChargeTypeRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomChargeTypeRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RoomChargeTypeOperationComponent extends BaseOperationComponent<RoomChargeType> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomChargeTypeOperationComponent>,
    service: RoomChargeTypeService,
    uiService: RoomChargeTypeUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomChargeTypeEdit = signal(true);
  isRoomChargeTypeRemove = signal(true);

  override initControl(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
        roomNumber: [null, [required]],
        chargeType: [null, [required]],
        limit: [null, required],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      id: this.model.id,
      roomNumber: this.model.roomNumber,
      chargeType: this.model.chargeType,
      limit: this.model.limit,
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
