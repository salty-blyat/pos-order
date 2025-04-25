import { Component } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { RoomType, RoomTypeService } from "./room-type.service";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { RoomTypeUiService } from "./room-type-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-room-type-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.name || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <app-loading [loading]="loading" />
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "Name" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "Occupancy" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="occupancy" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "MaxOccupancy" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="maxOccupancy" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "NetArea" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="netArea" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "GrossArea" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="grossArea" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "Note" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <textarea
              nz-input
              formControlName="note"
              rows="3"
              style="width: 100%;"
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
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!loading && isRoomTypeEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isRoomTypeEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isRoomTypeRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isRoomTypeRemove"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation_page.scss"],
  standalone: false,
})
export class RoomTypeOperationComponent extends BaseOperationComponent<RoomType> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomTypeOperationComponent>,
    service: RoomTypeService,
    uiService: RoomTypeUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomTypeEdit: boolean = true;
  isRoomTypeRemove: boolean = true;

  override ngOnInit(): void {
    if (this.loading) return;
    this.initControl();
  }

  override initControl(): void {
    const {
      nameExistValidator,
      required,
      nameMaxLengthValidator,
      integerValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      occupancy: [null, [required]],
      maxOccupancy: [null, [required, integerValidator]],
      netArea: [0],
      grossArea: [0],
      note: [null],
    });
  }

  override setFormValue() {
    if (!this.model) {
      return;
    }
    this.frm.patchValue({
      id: this.model.id,
      name: this.model.name,
      maxOccupancy: this.model.maxOccupancy,
      occupancy: this.model.occupancy,
      netArea: this.model.netArea,
      grossArea: this.model.grossArea,
      note: this.model.note,
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
