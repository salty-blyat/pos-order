import {Component, signal, ViewEncapsulation} from "@angular/core";
import {BaseOperationComponent} from "../../utils/components/base-operation.component";
import {RoomMember, RoomMemberService} from "./room-member.service";
import {FormBuilder} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {CommonValidators} from "../../utils/services/common-validators";
import {RoomMemberUiService} from "./room-member-ui.service";

@Component({
  selector: 'app-room-member-operation',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView">
            {{ "Edit" | translate }} {{ model?.memberName || ("Loading" | translate) }}
          </span>
          <span *ngIf="modal?.id && modal?.isView">
            {{ model?.memberName || ("Loading" | translate) }}
        </span>
      </div>

      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "Member" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <app-member-select formControlName="memberId"></app-member-select>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "JoinedDate" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <app-date-input formControlName="joinedDate"></app-date-input>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24">{{
                          "Note" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <textarea rows="3" nz-input="" formControlName="note"></textarea>
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
                      *ngIf="!isLoading() && isRoomMemberEdit()"
              >
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isRoomMemberEdit()"
              ></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading() && isRoomMemberRemove()"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isRoomMemberRemove()"
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
  encapsulation: ViewEncapsulation.None
})

export class RoomMemberOperationComponent extends BaseOperationComponent<RoomMember>{
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomMemberOperationComponent>,
    service: RoomMemberService,
    uiService: RoomMemberUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomMemberEdit = signal(true);
  isRoomMemberRemove = signal(true);

  override initControl(): void {
    const {
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      roomId: [this.modal?.roomId, [required]],
      memberId: [null, [required]],
      joinedDate: [null, [required, noteMaxLengthValidator]],
      note: [null]
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      roomId: this.model.roomId,
      memberId: this.model.memberId,
      joinedDate: this.model.joinedDate,
      note: this.model.note,
    });
  }

}