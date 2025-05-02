import { Component, computed, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { RoomType, RoomTypeService } from "./room-type.service";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { RoomTypeUiService } from "./room-type-ui.service";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

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
      <app-loading *ngIf="isLoading()"></app-loading>
      <form
        nz-form
        [formGroup]="frm"
        [nzAutoTips]="autoTips"
        class="form-content"
      >
        <div nz-row>
          <div nz-col nzSpan="24">
            <nz-form-item>
              <nz-form-label nzSpan="5" nzRequired>{{
                "Name" | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="19" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-row>
              <nz-col nzSpan="11">
                <nz-form-item>
                  <nz-form-label nzSpan="11" nzRequired>{{
                    "Occupancy" | translate
                  }}</nz-form-label>
                  <nz-form-control nzSpan="12" nzErrorTip="">
                    <nz-input-number
                      [nzMin]="0"
                      [nzStep]="1"
                      [nzPrecision]="0"
                      formControlName="occupancy"
                    />
                  </nz-form-control>
                </nz-form-item>
              </nz-col>
              <nz-col nzSpan="13">
                <nz-form-item>
                  <nz-form-label nzSpan="13" nzRequired>{{
                    "MaxOccupancy" | translate
                  }}</nz-form-label>
                  <nz-form-control nzSpan="11" nzErrorTip="">
                    <nz-input-number
                      [nzMin]="0"
                      [nzStep]="1"
                      [nzPrecision]="0"
                      formControlName="maxOccupancy"
                    />
                  </nz-form-control>
                </nz-form-item>
              </nz-col>
            </nz-row>
            <nz-row>
              <nz-col nzSpan="11">
                <nz-form-item>
                  <nz-form-label nzSpan="11">{{
                    "NetArea" | translate
                  }}</nz-form-label>
                  <nz-form-control nzSpan="12" nzErrorTip="">
                    <input nz-input formControlName="netArea" />
                  </nz-form-control>
                </nz-form-item>
              </nz-col>
              <nz-col nzSpan="13">
                <nz-form-item>
                  <nz-form-label nzSpan="13">{{
                    "GrossArea" | translate
                  }}</nz-form-label>
                  <nz-form-control nzSpan="11" nzErrorTip="">
                    <input nz-input formControlName="grossArea" />
                  </nz-form-control>
                </nz-form-item>
              </nz-col>
            </nz-row>
            <nz-form-item>
              <nz-form-label nzSpan="5">{{ "Note" | translate }}</nz-form-label>
              <nz-form-control nzSpan="19">
                <textarea
                  nz-input
                  type="text"
                  formControlName="note"
                  rows="3"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
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
          *ngIf="!isLoading() && isRoomTypeEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomTypeEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isRoomTypeRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isRoomTypeRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class RoomTypeOperationComponent extends BaseOperationComponent<RoomType> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomTypeOperationComponent>,
    private authService: AuthService,
    service: RoomTypeService,
    uiService: RoomTypeUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomTypeEdit = computed<boolean>(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_TYPE));
  isRoomTypeRemove = computed<boolean>(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__ROOM_TYPE));

  override ngOnInit(): void {
    if (this.isLoading()) return;
    this.initControl();
    super.ngOnInit();
  }

  override initControl(): void {
    const { nameExistValidator, required, nameMaxLengthValidator } =
      CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      occupancy: [null, [required]],
      maxOccupancy: [0, [required]],
      netArea: [0, [required]],
      grossArea: [0, [required]],
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
}
