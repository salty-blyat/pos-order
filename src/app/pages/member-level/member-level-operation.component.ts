import { Component, signal, ViewEncapsulation } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { MemberLevelService } from "./member-level.service";
import { MemberLevel } from "./member-level.service";
import { MemberLevelUiService } from "./member-level-ui.component";
import {
  SETTING_KEY,
  SystemSettingService,
} from "../system-setting/system-setting.service";

@Component({
  selector: "app-member-level-operation",
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
            >{{ "Code" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input
              nz-input
              formControlName="code"
              [placeholder]="
                memberLevelAutoIdEnable() ? ('NewCode' | translate) : ''
              "
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "Name" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
            >{{ "LevelStay" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="levelStay" />
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
          *ngIf="!isLoading() && isMemberLevelEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberLevelEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isMemberLevelRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isMemberLevelRemove"
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
export class MemberLevelOperationComponent extends BaseOperationComponent<MemberLevel> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<MemberLevelOperationComponent>,
    public systemSettingService: SystemSettingService,
    service: MemberLevelService,
    uiService: MemberLevelUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isMemberLevelEdit: boolean = true;
  isMemberLevelRemove: boolean = true;
  memberLevelAutoIdEnable = signal<boolean>(false);

  override initControl(): void {
    const {
      required,
      noteMaxLengthValidator,
      nameExistValidator,
      codeExistValidator,
      integerValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [required, noteMaxLengthValidator()],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, noteMaxLengthValidator()],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      levelStay: [null, [required, integerValidator]],
      note: [null],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      levelStay: this.model.levelStay,
      note: this.model.note,
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const { required } = CommonValidators;
    this.systemSettingService.find(SETTING_KEY.MemberLevelAutoId).subscribe({
      next: (result: any) => { 
        if (result === 0) {
          this.memberLevelAutoIdEnable.set(false);
          this.frm.controls["code"].enable();
          this.frm.controls["code"].setValidators([required]);
        } else {
          this.memberLevelAutoIdEnable.set(true);
          this.frm.controls["code"].disable();
          this.frm.controls["code"].setValidators([]);
        } 
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { },
    });
  }
}
