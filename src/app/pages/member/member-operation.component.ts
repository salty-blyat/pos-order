import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { CommonValidators } from "../../utils/services/common-validators";
import { Member, MemberService } from "./member.service";
import { MemberUiService } from "./member-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-member-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
      >{{ "Edit" | translate }}
        {{ model?.code || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
          model?.code || ("Loading" | translate)
        }}</span>
    </div>
    <div class="modal-content">
      <nz-spin
          *ngIf="isLoading"
          style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <form
          nz-form
          [formGroup]="frm"
          
          [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Code" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="code"/>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Name" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Sex" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <app-lookup-item-select formControlName="sexId"
                                    [lookupType]="this.lookupItemType.GenderId"
            ></app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Unit" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="unit"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Level" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="level"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
              "Phone" | translate
            }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="phone"/>
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
          <i *ngIf="isLoading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a
            (click)="uiService.showEdit(model.id || 0)"
            *ngIf="!isLoading && isMemberEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
            nzType="vertical"
            *ngIf="!isLoading && isMemberEdit"
        ></nz-divider>
        <a
            nz-typography
            nzType="danger"
            (click)="uiService.showDelete(model.id || 0)"
            *ngIf="!isLoading && isMemberRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
            nzType="vertical"
            *ngIf="!isLoading && isMemberRemove"
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
export class MemberOperationComponent extends BaseOperationComponent<Member> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberOperationComponent>,
    service: MemberService,
    uiService: MemberUiService
  ) {
    super(fb, ref, service, uiService);
  }
  lookupItemType = LOOKUP_TYPE;
  isMemberEdit: boolean = true;
  isMemberRemove: boolean = true;
  override ngOnInit(): void {
    super.ngOnInit();
  }

  override initControl() {
    const { codeExistValidator, nameMaxLengthValidator, required } =
      CommonValidators;
    this.frm = this.fb.group({
      code: [null, [codeExistValidator(this.service, this.modal?.id)]],
      name: [null, [required, nameMaxLengthValidator]],
      sexId: [null, [required]],
      unit: [null, [required]],
      level: [null, [required]],
      phone: [null],
      nationality: [null],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      sexId: this.model.sexId,
      unit: this.model.unit,
      level: this.model.level,
      phone: this.model.phone,
      nationality: this.model.nationality,
    });
  }
}
