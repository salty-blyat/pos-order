import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseDeleteComponent } from "../../utils/components/base-delete.component";
import { Redemption, RedemptionService } from "./redemption.service";
import { RedemptionUiService } from "./redemption-ui.service";
import { finalize, Observable, of, switchMap } from "rxjs";

@Component({
  selector: "app-redemption-delete",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="modal?.id"
        >{{ "Remove" | translate }}
        {{ model?.redeemNo || ("loading" | translate) }}</span
      >
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <div
        *ngIf="errMessage() && !isLoading()"
        nz-row
        nzJustify="center"
        style="margin:2px 0"
      >
        <span nz-typography nzType="danger">{{
          errMessage() | translate
        }}</span>
      </div>
      <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            "RedeemNo" | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
            <input nz-input formControlName="redeemNo" />
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
      <button
        *ngIf="!errMessage() && model?.redeemNo"
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
export class RedemptionDeleteComponent extends BaseDeleteComponent<Redemption> {
  constructor(
    service: RedemptionService,
    public redemptionService: RedemptionService,
    uiService: RedemptionUiService,
    ref: NzModalRef<RedemptionDeleteComponent>,
    fb: FormBuilder
  ) {
    super(service, uiService, ref, fb);
  }
  override ngOnInit(): void {
    this.initControl();
    if (this.modal.id) {
      this.isLoading.set(true);
      const canRemove$: Observable<{ can: boolean; message?: string }> = of({
        can: true,
      });
      const find$: Observable<any> = canRemove$.pipe(
        switchMap((x: any) => {
          if (!x.can) {
            this.errMessage.set(x.message);
            this.frm.disable();
          }
          return this.redemptionService.find(this.modal.id);
        })
      );
      find$
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe((result: Redemption) => {
          this.model = result;
          this.setFormValue();
        });
    }
  }
  override initControl() {
    const { required, noteMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      redeemNo: [{ value: null, disabled: true }, [required]],
      note: [null, noteMaxLengthValidator],
    });
  }
  override setFormValue() { 
    this.frm.setValue({
      redeemNo: this.model.redeemNo,
      note: "",
    });
  }
}
