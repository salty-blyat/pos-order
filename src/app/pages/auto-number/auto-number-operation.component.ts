import { Component, computed, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { AutoNumber, AutoNumberService } from "./auto-number.service";
import { AutoNumberUiService } from "./auto-number-ui.service";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { AuthKeys } from "../../const";

@Component({
  selector: "app-auto-number-operation",
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
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
            >{{ "Name" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
            >{{ "Format" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="format" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24"
            >{{ "Note" | translate }}
          </nz-form-label>
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
          *ngIf="!isLoading() && isAutoNumberEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAutoNumberEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isAutoNumberRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAutoNumberRemove()"
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
export class AutoNumberOperationComponent extends BaseOperationComponent<AutoNumber> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<AutoNumberOperationComponent>,
    service: AutoNumberService,
    private authService: AuthService,
    uiService: AutoNumberUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isAutoNumberEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__AUTO_NUMBER__EDIT));
  isAutoNumberRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__SETTING__AUTO_NUMBER__REMOVE)); 

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      noteMaxLengthValidator,
      nameExistValidator,
      required,
    } = CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [nameMaxLengthValidator(), required],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      format: [null, [required]],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      format: this.model.format,
      note: this.model.note,
    });
  }
}
