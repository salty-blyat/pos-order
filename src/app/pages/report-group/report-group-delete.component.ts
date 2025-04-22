import {Component, inject, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {CommonValidators} from "../../utils/services/common-validators";
import {switchMap} from "rxjs";
import {finalize} from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import {ReportGroup, ReportGroupService} from "./report-group.service";

@Component({
    selector: 'app-report-group-delete',
    template: `
  <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal.id">{{'Remove' | translate}}  {{ (model.name || ('Loading'|translate))}}</span>
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

export class ReportGroupDeleteComponent implements OnInit{
  constructor(
    private fb : FormBuilder,
    private ref: NzModalRef<ReportGroupDeleteComponent>,
    private service: ReportGroupService
  ) {
  }

  readonly modal: any = inject(NZ_MODAL_DATA);
  loading = false;
  model: ReportGroup = {};
  errMessage: string = '';
  frm!: FormGroup;
  autoTips = CommonValidators.autoTips;

  ngOnInit(): void {
    this.initControl();
    if (this.modal.id){
      const canRemove$ = this.service.inused(this.modal.id);
      const find$ = canRemove$.pipe(switchMap((x:any) =>{
        if (!x.can){
          this.errMessage = x.message;
          this.frm.disable();
        }
        return this.service.find(this.modal.id);
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

  initControl(){
    const  {required,noteMaxLengthValidator} = CommonValidators
    this.frm = this.fb.group({
      name: [null,required],
      note: [null,noteMaxLengthValidator]
    })
  }

  submit(): void{
    if (this.loading){
      return;
    }
    if (!this.frm.valid){
      return;
    }
    this.loading = true;
    this.model.id = this.modal.id;
      this.service.delete({id: this.modal.id, note: this.frm.value.note}).subscribe(() => {
      this.loading = false;
      this.ref.triggerOk().then();
    }, (error: HttpErrorResponse) => {
      this.loading = false;
    })
  }

  cancel(){
    this.ref.triggerCancel().then();
  }

}
