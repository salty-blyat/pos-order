import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CommonValidators } from '../../utils/services/common-validators';
import { ReportGroup, ReportGroupService } from './report-group.service';
import { ReportGroupUiService } from './report-group-ui.service';
import { AuthService } from '../../helpers/auth.service';
import {BaseOperationComponent} from "../../utils/components/base-operation.component";

@Component({
    selector: 'app-report-group-operation',
    template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!id">{{ 'Add' | translate }}</span>
      <span *ngIf="id && !isView"
        >{{ 'Edit' | translate }}
        {{ model.name || ('Loading' | translate) }}</span
      >
      <span *ngIf="id && isView">{{
        model.name || ('Loading' | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="loading"
        style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <form
        nz-form
        [formGroup]="frm"
        
        [nzAutoTips]="autoTips"
      >
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
      <div *ngIf="!isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid"
          (click)="onSubmit()"
        >
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ 'Save' | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ 'Cancel' | translate }}
        </button>
      </div>
      <div *ngIf="isView">
        <a
          nz-typography
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!loading && isReportGroupEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Edit' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isReportGroupEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isReportGroupRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Delete' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isReportGroupRemove"
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

  @Input() id: number = 0;
  @Input() isView: boolean = false;
  loading = false;
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
    if (this.modal.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key == 'edited') {
          this.loading = true;
          this.service.find(this.id).subscribe(
            (result: ReportGroup) => {
              this.loading = false;
              this.model = result;
              this.setFormValue();
            },
            (error: any) => {
              console.log(error);
            }
          );
        } else {
          this.cancel();
        }
      });
    }
  
    if (this.modal.id) {
    
      this.loading = true;
      this.service.find(this.modal.id).subscribe((result: ReportGroup) => {

        console.log(result);
        
        this.loading = false;
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
        [nameExistValidator(this.service, this.id)],
      ],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override onSubmit() {
    if (this.frm.valid && !this.loading) {
      this.loading = true;
      let operation$ = this.service.add(this.frm.value);
      if (this.id) {
        operation$ = this.service.edit({ ...this.frm.value, id: this.id });
      }
      operation$.subscribe(
        (result: ReportGroup) => {
          this.loading = false;
          this.model = result;
          this.ref.triggerOk().then();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: this.model.note,
    });
  }
}
