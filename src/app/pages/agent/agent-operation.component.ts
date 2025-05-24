import { Component, computed, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { Agent, AgentService } from "./agent.service";
import { AgentUiService } from "./agent-ui.service";
@Component({
  selector: "app-agent-operation",
  template: ` <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.name || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content" style="margin">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form
        nz-form
        [formGroup]="frm"
        [style.height.%]="100"
        [nzAutoTips]="autoTips"
      >
        <div nz-row>
          <div nz-col [nzXs]="12">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Code" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <input
                  [autofocus]="true"
                  nz-input
                  formControlName="code"
                  [placeholder]="
                    frm.controls['code'].disabled ? ('NewCode' | translate) : ''
                  "
                />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzXs]="12">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24"
                >{{ "JoinDate" | translate }}
              </nz-form-label>

              <nz-form-control [nzSm]="14" [nzXs]="24">
                <nz-date-picker formControlName="joinDate"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <div nz-row>
          <div nz-col [nzXs]="12">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Name" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col [nzXs]="12">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Phone" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
                <input nz-input formControlName="phone" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <div nz-row>
          <div nz-col [nzXs]="12">
            <nz-form-item>
              <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
                >{{ "Email" | translate }}
              </nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
                <input nz-input formControlName="email" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
        <nz-form-item>
          <nz-form-label [nzSpan]="4"
            >{{ "Address" | translate }}
          </nz-form-label>
          <nz-form-control [nzXs]="19">
            <textarea
              nz-input
              type="text"
              formControlName="address"
              rows="3"
            ></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4">{{ "Note" | translate }} </nz-form-label>
          <nz-form-control [nzXs]="19">
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
          *ngIf="!isLoading() && isAgentEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAgentEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isAgentRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isAgentRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>`,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class AgentOperationComponent extends BaseOperationComponent<Agent> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<AgentOperationComponent>,
    service: AgentService,
    private authService: AuthService,
    uiService: AgentUiService
  ) {
    super(fb, ref, service, uiService);
  }
  isAgentEdit = computed(() => true);
  isAgentRemove = computed(() => true);

  override initControl(): void {
    const {
      nameMaxLengthValidator,
      noteMaxLengthValidator,
      nameExistValidator,
      codeMaxLengthValidator,
      codeExistValidator,
      required,
      multiplePhoneValidator,
      emailValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [codeMaxLengthValidator, required],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [nameMaxLengthValidator, required],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      email: [null, [emailValidator, required]],
      phone: [null, [multiplePhoneValidator, required]],
      address: [null],
      joinDate: [new Date().toISOString()],
      note: [null, [noteMaxLengthValidator()]],
    });
     this.frm
      .get("code")
      ?.valueChanges.subscribe((v) => console.log(this.frm.getRawValue()));
  }

  override setFormValue() {
    this.frm.setValue({
      code: this.model.code,
      name: this.model.name,
      email: this.model.email,
      phone: this.model.phone,
      address: this.model.address,
      joinDate: this.model.joinDate,
      note: this.model.note,
    });
  }
}
