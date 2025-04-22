import {Component, inject, Input} from "@angular/core";
import {CommonValidators} from "../../../utils/services/common-validators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {finalize, switchMap} from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import {LookupItem, LookupItemService} from "./lookup-item.service";


@Component({
    selector: 'app-lookup-item-delete',
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
    styles: [`
    ::ng-deep .ant-modal {
      top:  116px;
    }
  `],
    styleUrls: ['../../../../assets/scss/operation_modal.scss'],
    standalone: false
})

export class LookupItemDeleteComponent {
  
  readonly modal: any = inject(NZ_MODAL_DATA);
  autoTips = CommonValidators.autoTips;
  loading = false;
  model: LookupItem={};
  frm!: FormGroup;
  errMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private ref: NzModalRef<LookupItemDeleteComponent>,
    private service: LookupItemService,
  ) { }

  ngOnInit(): void {
    this.initControl();
    if (this.modal.id){
      this.loading = true;
      const canRemove$ = this.service.inused(this.modal.id);
      const find$ = canRemove$.pipe(switchMap((x:any) => {
        if (!x.can){ this.errMessage = x.message; this.frm.disable()}
        return this.service.find(this.modal.id);
      }));
      find$.pipe(finalize(() => this.loading = false))
        .subscribe((result: any) => {
          this.model = result;
          this.frm.setValue({
            name: result.name,
            note: ''
          });
        });
    }
  }
  initControl(): void{
    const { noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      name: [{value: null, disabled: true}, [Validators.required]],
      note: [null, [ noteMaxLengthValidator() ]]
    });
  }
  submit(): void{
    if (this.loading) { return; }
    if (!this.frm.valid ) { return; }
    this.loading = true;
    this.model.id = this.modal.id;
      this.service.delete({id: this.modal.id, note: this.frm.value.note}).subscribe(
      () => {
        this.loading = false;
        this.ref.triggerOk();
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
      }
    );
  }
  cancel(): void{
    this.ref.triggerCancel();
  }
}
