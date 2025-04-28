import { Component, ViewEncapsulation} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CommonValidators } from '../../utils/services/common-validators';
import { ReportGroup, ReportGroupService } from './report-group.service';
import { ReportGroupUiService } from './report-group-ui.service';
import { AuthService } from '../../helpers/auth.service';
import { BaseOperationComponent } from "../../utils/components/base-operation.component";

@Component({
    selector: 'app-report-group-operation',
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
      <app-loading *ngIf="isLoading()"></app-loading>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
            'Name' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="7" [nzXs]="24">{{
            'Note' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
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
      <div *ngIf="!modal?.isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid"
          (click)="onSubmit()"
        >
          <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
          {{ 'Save' | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ 'Cancel' | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a
          nz-typography
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!isLoading() && isReportGroupEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Edit' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isReportGroupEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isReportGroupRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Delete' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isReportGroupRemove"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Close' | translate }}</span>
        </a>
      </div>
    </div>
  `,
    styleUrls: ['../../../assets/scss/operation.style.scss'],
    standalone: false,
    encapsulation: ViewEncapsulation.None
})
export class ReportGroupOperationComponent extends BaseOperationComponent<ReportGroup>{
  constructor(
     fb: FormBuilder,
     ref: NzModalRef<ReportGroupOperationComponent>,
     service: ReportGroupService,
     uiService: ReportGroupUiService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService)
  }

  isReportGroupEdit: boolean = true;
  isReportGroupRemove: boolean = true;

  override ngOnInit(): void {
    // this.isReportGroupEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__EDIT
    // );
    // this.isReportGroupRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT_GROUP__REMOVE
    // );

    this.initControl();   
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key == 'edited') {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: ReportGroup) => {
              this.isLoading.set(false);
              this.model = result;
              this.setFormValue();
            },
            error: (error: any) => {
              console.log(error);
              this.isLoading.set(false);
            }
          });
        } else {
          this.cancel();
        }
      });
    }
  
    if (this.modal?.id) {
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe((result: ReportGroup) => {
        this.isLoading.set(false);
        this.model = result;
        this.setFormValue();
      });
    }
  }

  override initControl() {
    const {
      nameExistValidator,
      nameMaxLengthValidator,
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override onSubmit() {
    if (this.frm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      let operation$ = this.service.add(this.frm.value);
      if (this.modal?.id) {
        operation$ = this.service.edit({ ...this.frm.value, id: this.modal?.id });
      }
      operation$.subscribe({
          next: (result: ReportGroup) => {
            this.isLoading.set(false);
            this.model = result;
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
          }
        });
    }
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: this.model.note,
    });
  }
}
