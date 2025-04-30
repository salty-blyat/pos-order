import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { BaseDeleteComponent } from '../../utils/components/base-delete.component';
import { TagGroup, TagGroupService } from './tag-group.service';
import { TagGroupUiService } from './tag-group-ui.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { CommonValidators } from '../../utils/services/common-validators';

@Component({
    selector: 'app-tag-group-delete',
    template: `
        <div *nzModalTitle class="modal-header-ellipsis">
            <span *ngIf="modal?.id">{{ "Remove" | translate }} {{ model?.name || ("loading" | translate) }}</span>
        </div>
        <div class="modal-content">
            <nz-spin *ngIf="isLoading()" style="position: absolute; top: 50%; left: 50%"></nz-spin>
            <div *ngIf="errMessage() && !isLoading()" nz-row nzJustify="center" style="margin:2px 0">
                <span nz-typography nzType="danger" style="position: absolute">{{ errMessage() | translate }}</span>
            </div>
            <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
                <nz-form-item>
                    <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ "Name" | translate }}</nz-form-label>
                    <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
                        <input nz-input formControlName="name"/>
                    </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                    <nz-form-label [nzSm]="6" [nzXs]="24">{{ "Note" | translate }}</nz-form-label>
                    <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
                        <textarea nz-input type="text" formControlName="note" rows="3"></textarea>
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
    styleUrls: ["../../../assets/scss/operation.style.scss"],
    standalone: false,
    encapsulation: ViewEncapsulation.None,
})
export class TagGroupDeleteComponent extends BaseDeleteComponent<TagGroup> implements OnInit {
  constructor(
    service: TagGroupService,
    uiService: TagGroupUiService,
    ref: NzModalRef<TagGroupDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }
  override initControl() {
    const { noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }],
      note: [null, noteMaxLengthValidator],
    });
  }
  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: "",
    });
  }

}
