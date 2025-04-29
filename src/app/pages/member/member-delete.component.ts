import {Component, ViewEncapsulation} from "@angular/core";
import {BaseDeleteComponent} from "../../utils/components/base-delete.component";
import {Member, MemberService} from "./member.service";
import {MemberUiService} from "./member-ui.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-member-delete',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
      >{{ "Remove" | translate }}
          {{ model?.name || ("Loading" | translate) }}</span
      >
      </div>
      <div class="modal-content">
          <nz-spin
                  *ngIf="isLoading()"
                  style="position: absolute; top: 50%; left: 50%"
          ></nz-spin>
          <div
                  *ngIf="errMessage() && !isLoading()"
                  nz-row
                  nzJustify="center"
                  style="margin:2px 0"
          >
        <span nz-typography nzType="danger" style="position: absolute">{{
                errMessage() | translate
            }}</span>
          </div>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
                  >{{ "Name" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
                      <input nz-input formControlName="name"/>
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
  styleUrls: ['../../../assets/scss/operation.style.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class MemberDeleteComponent extends BaseDeleteComponent<Member>{
  constructor(
    service: MemberService,
    uiService: MemberUiService,
    ref: NzModalRef<MemberDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }
}