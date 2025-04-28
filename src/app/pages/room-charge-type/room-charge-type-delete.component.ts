import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseDeleteComponent } from "../../utils/components/base-delete.component";
import {
  RoomChargeType,
  RoomChargeTypeService,
} from "./room-charge-type.service";
import { RoomChargeTypeUiService } from "./room-charge-type-ui.service";

@Component({
  selector: "app-room-charge-type-delete",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
        >{{ "Remove" | translate }}
        {{ model?.roomNumber || ("Loading" | translate) }}</span
      >
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="isLoading()"
        style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <div
        *ngIf="errMessage() && !isLoading()"
        nz-row
        nzJustify="center"
        style="margin:2px 0"
      >
        <span
          nz-typography
          nzType="danger"
          style="position: absolute; z-index: 1; top: 18%"
          >{{ errMessage() | translate }}</span
        >
      </div>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "RoomName" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="roomName" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24"
            >{{ "Note" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
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
      <button
        *ngIf="!errMessage() && model?.roomNumber"
        nz-button
        nzDanger
        nzType="primary"
        [disabled]="!frm.valid"
        (click)="onSubmit($event)"
      >
        <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
        {{ "Delete" | translate }}
      </button>
      <button nz-button nzType="default" (click)="cancel()">
        {{ "Cancel" | translate }}
      </button>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class RoomChargeTypeDeleteComponent extends BaseDeleteComponent<RoomChargeType> {
  constructor(
    service: RoomChargeTypeService,
    uiService: RoomChargeTypeUiService,
    ref: NzModalRef<RoomChargeTypeDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }

  override initControl(): void {
    const { noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      roomNumber: [{ value: null, disabled: true }, [Validators.required]],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      roomNumber: this.model.roomNumber,
      note: "",
    });
  }
}
