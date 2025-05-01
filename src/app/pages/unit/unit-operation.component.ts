import { Component, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { UnitUiService } from "./unit-ui.service";
import { Unit, UnitService } from "./unit.service";

@Component({
  selector: "app-unit-operation",
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
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Name" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24"
            >{{ "Note" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <textarea nz-input rows="3" formControlName="note"></textarea>
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
          *ngIf="!isLoading() && isUnitEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isUnitEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isUnitRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isUnitRemove"
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
export class UnitOperationComponent extends BaseOperationComponent<Unit> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<UnitOperationComponent>,
    service: UnitService,
    uiService: UnitUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isUnitEdit: boolean = true;
  isUnitRemove: boolean = true;

  override initControl(): void {
    const { required, noteMaxLengthValidator, nameExistValidator } =
      CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required, noteMaxLengthValidator()],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: this.model.note,
    });
  }
}
