import {Component, ViewEncapsulation} from "@angular/core";
import {BaseDeleteComponent} from "../../utils/components/base-delete.component";
import {RoomMember, RoomMemberService} from "./room-member.service";
import {RoomMemberUiService} from "./room-member-ui.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-room-member-delete',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
      >{{ "Remove" | translate }}
          {{ model?.roomNumber || ("Loading" | translate) }}</span
      >
      </div>
      <div class="modal-content">
          <app-loading
                  *ngIf="isLoading()"
          ></app-loading>

          <div *ngIf="errMessage() && !isLoading()" class="delete-error-message ">
              <span nz-typography nzType="danger">{{ errMessage() | translate }}</span>
          </div>

          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          "Name" | translate
                      }}</nz-form-label>
                  <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
                      <input nz-input formControlName="name" />
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
                    rows="3"
            ></textarea>
                  </nz-form-control>
              </nz-form-item>
          </form>
      </div>
      <div *nzModalFooter>
          <button *ngIf="!errMessage() && model?.roomNumber" 
                  nz-button nzDanger nzType="primary" 
                  [disabled]="!frm.valid"
                  (click)="onSubmit($event)">
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

export class RoomMemberDeleteComponent extends BaseDeleteComponent<RoomMember>{
  constructor(
    service: RoomMemberService,
    uiService: RoomMemberUiService,
    ref: NzModalRef<RoomMemberDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }
}
