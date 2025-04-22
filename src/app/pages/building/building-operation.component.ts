import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import { Building, BuildingService } from "./building.service";
import { BuildingUiService } from "./building-ui.service";

@Component({
  selector: "app-building-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.buildingName || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.buildingName || ("Loading" | translate)
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
            "Code" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="code" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "Building Name" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="buildingName" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "Note" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
            <textarea nz-input formControlName="note" rows="3"></textarea>
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
        <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!loading">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading"></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading"></nz-divider>
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
export class BuildingOperationComponent extends BaseOperationComponent<Building> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<BuildingOperationComponent>,
    override service: BuildingService,
    override uiService: BuildingUiService
  ) {
    super(fb, ref, service, uiService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override initControl(): void {
    const {
      required,
      codeMaxLengthValidator,
      codeExistValidator,
      nameMaxLengthValidator,
      nameExistValidator,
      noteMaxLengthValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      code: [
        null,
        [required, codeMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      buildingName: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator]],
    });
  }

  override setFormValue(): void {
    this.frm.patchValue({
      code: this.model.code,
      buildingName: this.model.buildingName,
      note: this.model.note,
    });
  }
}
