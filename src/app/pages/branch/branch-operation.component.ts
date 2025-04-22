import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Branch, BranchService, User } from './branch.service';
import { BranchUiService } from './branch-ui.service';
import { AuthService } from '../../helpers/auth.service';
import { BaseOperationComponent } from '../../utils/components/base-operation.component';
import { CommonValidators } from '../../utils/services/common-validators';

@Component({
    selector: 'app-branch-operation',
    template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ 'Add' | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ 'Edit' | translate }}
        {{ model?.name || ('Loading' | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ('Loading' | translate)
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
            'Code' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="code" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Name' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Phone' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24">
            <input nz-input formControlName="phone" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Address' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
            <textarea nz-input formControlName="address" rows="3"></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            'Note' | translate
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
          {{ 'Save' | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ 'Cancel' | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!loading">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Edit' | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading"></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Delete' | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading"></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Close' | translate }}</span>
        </a>
      </div>
    </div>
  `,
    styleUrls: ['../../../assets/scss/operation_page.scss'],
    standalone: false
})
export class BranchOperationComponent extends BaseOperationComponent<Branch> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<BranchOperationComponent>,
    override service: BranchService,
    override uiService: BranchUiService
  ) {
    super(fb, ref, service, uiService);
  }

  listOfUsers: User[] = [];

  override ngOnInit(): void {
    super.ngOnInit();
    this.uiService.refresher.subscribe((user) => {
      if (user.key === 'addUser') {
        this.usernames.clear();
        user.value?.map((value: any) => {
          this.addUsername(value);
        });
      }
    });
  }

  get usernames(): FormArray {
    return this.frm.get('userNames') as FormArray;
  }

  override initControl(): void {
    const {
      required,
      codeMaxLengthValidator,
      codeExistValidator,
      nameMaxLengthValidator,
      nameExistValidator,
      noteMaxLengthValidator,
      multiplePhoneValidator,
      phoneExistValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      code: [
        null,
        [required, codeMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator]],
      userNames: this.fb.array([]),
      address: [null, [required]],
      phone: [
        null,
        [required, multiplePhoneValidator],
        [phoneExistValidator(this.service, this.modal?.id)],
      ],
    });
  }

  addUsername(user?: User): void {
    const username = this.fb.group({
      name: [user?.name],
      fullName: [user?.fullName],
      profile: [user?.profile],
    });

    this.usernames.push(username);
  }
  removeFormList(index: number): void {
    this.usernames.removeAt(index);
  }

  override setFormValue(): void {
    this.usernames.clear();
    this.frm.patchValue({
      code: this.model.code,
      name: this.model.name,
      note: this.model.note,
      phone: this.model.phone,
      address: this.model.address,
    });

    if (this.model.userNames) {
      this.model.userNames.map((name) => {
        this.addUsername(name);
      });
    }
  }
}
