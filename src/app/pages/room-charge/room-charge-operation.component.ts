import { Component, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { RoomCharge, RoomChargeService } from "./room-charge.service";
import { RoomChargeUiService } from "./room-charge-ui.service";

@Component({
  selector: "app-room-charge-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView">
        {{ "Edit" | translate }}
        {{ model?.roomId || ("Loading" | translate) }}
      </span>
      <span *ngIf="modal?.id && modal?.isView">
        {{ model?.roomId || ("Loading" | translate) }}
      </span>
    </div>

    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "Serial" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="serial"
          /></nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "RoomNumber" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-room-select
              storageKey="room-filter"
              formControlName="roomId"
              [addOption]="true"
            ></app-room-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "Charge" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-charge-select
              storageKey="charge-filter"
              formControlName="chargeId"
              [addOption]="true"
            ></app-charge-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
            {{ "Status" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-select formControlName="statusId">
              <nz-option [nzValue]="1" nzLabel="Active"></nz-option>
              <nz-option [nzValue]="2" nzLabel="InActive"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "Limit" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input type="number" formControlName="totalLimit" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            "StartDate" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-date-picker formControlName="startDate"></nz-date-picker>
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
          *ngIf="!isLoading() && isRoomChargeEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomChargeEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isRoomChargeRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomChargeRemove()"
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
export class RoomChargeOperationComponent extends BaseOperationComponent<RoomCharge> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomChargeOperationComponent>,
    service: RoomChargeService,
    uiService: RoomChargeUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomChargeEdit = signal(true);
  isRoomChargeRemove = signal(true);

  override initControl(): void {
    const { required, integerValidator, noteMaxLengthValidator } =
      CommonValidators;
    this.frm = this.fb.group({
      // serial: [null, [required, noteMaxLengthValidator], [nameExistValidator(this.service, this.modal?.id)]],
      serial: [null, [required, noteMaxLengthValidator]],
      roomId: [null, [required]],
      statusId: [null, [required]],
      chargeId: [null, [required]],
      totalLimit: [null, [required, integerValidator]],
      startDate: [null, [required]],
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      serial: this.model.serial,
      roomId: this.model.roomId,
      chargeId: this.model.chargeId,
      totalLimit: this.model.totalLimit,
      statusId: this.model.statusId,
      startDate: this.model.startDate,
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
