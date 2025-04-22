import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { switchMap } from "rxjs";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Report, ReportService } from "./report.service";

@Component({
    selector: 'app-report-delete',
    template: `
  <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="id">{{'Remove' | translate}}  {{ (model.name || ('Loading'|translate))}}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <div *ngIf="errMessage && !loading" nz-row nzJustify="center" style="margin:2px 0">
        <span nz-typography nzType="danger" style="position: absolute">{{errMessage | translate}}</span>
      </div>
      <form nz-form [formGroup]="frm" (ngSubmit)="submit()" [nzAutoTips]="autoTips">
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
      <button *ngIf="!errMessage && model.name" nz-button nzDanger nzType="primary" [disabled]="!frm.valid" (click)="submit()" >
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

export class ReportDeleteComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ref: NzModalRef<ReportDeleteComponent>,
    private service: ReportService
  ) {
  }

  @Input() id: number = 0;
  loading = false;
  model: Report = {};
  errMessage: string = '';
  frm!: FormGroup;
  autoTips = CommonValidators.autoTips;

  ngOnInit(): void {
    this.initControl();
    if (this.id) {
      const canRemove$ = this.service.inused(this.id);
      const find$ = canRemove$.pipe(switchMap((x: any) => {
        if (!x.can) {
          this.errMessage = x.message;
          this.frm.disable();
        }
        return this.service.find(this.id);
      }));
      find$.pipe(finalize(() => this.loading = false)).subscribe(
        (result: any) => {
          this.model = result;
          this.frm.setValue({
            name: result.name,
            note: result.note || ""
          });
        }
      )
    }
  }

  initControl() {
    const { required, noteMaxLengthValidator } = CommonValidators
    this.frm = this.fb.group({
      name: [null, required],
      note: [null, noteMaxLengthValidator]
    })
  }

  submit(): void {
    if (this.loading) {
      return;
    }
    if (!this.frm.valid) {
      return;
    }
    this.loading = true;
    this.model.id = this.id;
    this.service.delete({ id: this.id, note: this.frm.value.note }).subscribe(() => {
      this.loading = false;
      this.ref.triggerOk().then();
    }, (error: HttpErrorResponse) => {
      this.loading = false;
    })
  }

  cancel() {
    this.ref.triggerCancel().then();
  }

}
