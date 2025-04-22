import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Branch, BranchService} from "./branch.service";
import {BaseDeleteComponent} from "../../utils/components/base-delete.component";
import {CommonValidators} from "../../utils/services/common-validators";
import { BranchUiService } from "./branch-ui.service";

@Component({
    selector: 'app-branch-delete',
    template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id">{{'Remove'| translate}}  {{ (model?.name || ('Loading'|translate))}}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <div *ngIf="errMessage && !loading" nz-row nzJustify="center" style="margin:2px 0">
        <span nz-typography nzType="danger" style="position: absolute">{{errMessage | translate}}</span>
      </div>
      <form nz-form [formGroup]="frm"  [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "Name" | translate
            }}</nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="name"/>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            "Note" | translate
            }}</nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
              <textarea
                nz-input
                type="text"
                formControlName="note"
                rows="5"
              ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button *ngIf="!errMessage && model?.name" nz-button nzDanger nzType="primary" [disabled]="!frm.valid" (click)="onSubmit($event)" >
        <i *ngIf="loading" nz-icon nzType="loading"></i>
        {{ "Delete" | translate }}
      </button>
      <button nz-button nzType="default" (click)="cancel()">
        {{ "Cancel" | translate }}
      </button>
    </div>
  `,
    styleUrls: ['../../../assets/scss/operation_modal.scss'],
    standalone: false
})
export class BranchDeleteComponent extends BaseDeleteComponent<Branch>{

  constructor(
      service: BranchService,
      uiService: BranchUiService,
      ref: NzModalRef<BranchDeleteComponent>,
      fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }

  override initControl(): void{
    const { noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      name: [{value: null, disabled: true}, [Validators.required]],
      note: [null, [ noteMaxLengthValidator() ]]
    });
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: ""
    })
  }
}
