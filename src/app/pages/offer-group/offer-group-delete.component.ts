import { Component, ViewEncapsulation } from "@angular/core";
import { BaseDeleteComponent } from "../../utils/components/base-delete.component"; 
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { OfferGroup, OfferGroupService } from "./offer-group.service";
import { OfferGroupUiService } from "./offer-group-ui.service";

@Component({
  selector: "app-offer-group-delete",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
        >{{ "Remove" | translate }}
        {{ model?.name || ("Loading" | translate) }}</span
      >
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <div  class="delete-error-message ">
        <span *ngIf="errMessage() && !isLoading()" nz-typography nzType="danger">{{
          errMessage() | translate
        }}</span>
      </div>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Name" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="name" />
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
        *ngIf="!errMessage() && model?.name"
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
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class OfferGroupDeleteComponent extends BaseDeleteComponent<OfferGroup> {
  constructor(
    service: OfferGroupService,
    uiService: OfferGroupUiService,
    ref: NzModalRef<OfferGroupDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }
  override initControl(): void {
    const { noteMaxLengthValidator, required } = CommonValidators;
    this.frm = this.fb.group({
        name: [{ value: null, disabled: true }, [required]],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override setFormValue() {
    this.frm.setValue({
        name: this.model.name,
      note: this.model.note,
    });
  }
}
