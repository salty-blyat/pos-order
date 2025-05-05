import {Component, signal, ViewEncapsulation} from "@angular/core";
import {BaseOperationComponent} from "../../../utils/components/base-operation.component";
import {BillingCycle, BillingCycleService} from "./billing-cycle.service";
import {FormBuilder} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {BillingCycleUiService} from "./billing-cycle-ui.service";
import {CommonValidators} from "../../../utils/services/common-validators";
import {Observable} from "rxjs";
import {endOfMonth, setDate} from "date-fns";

@Component({
  selector: 'app-billing-cycle-operation',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView">
              {{ "Edit" | translate }}
              {{ ((model?.startDate! | customDate) + ' ~ ' +  (model?.endDate! | customDate))  || ("Loading" | translate) }}
          </span>
          <span *ngIf="modal?.id && modal?.isView">
              {{ ((model?.startDate! | customDate) + ' ~ ' +  (model?.endDate! | customDate)) || ("Loading" | translate) }}
          </span>
      </div>
      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired
                  >{{ "Date" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24">
                      <app-date-range-input formControlName="dates"></app-date-range-input>
                  </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24">{{
                          "Note" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24">
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
                      *ngIf="!isLoading() && isBillingCycleEdit()"
              >
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isBillingCycleEdit()"
              ></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading() && isBillingCycleRemove()"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isBillingCycleRemove()"
              ></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Close" | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ['../../../../assets/scss/operation.style.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class BillingCycleOperationComponent extends BaseOperationComponent<BillingCycle>{
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<BillingCycleOperationComponent>,
    service: BillingCycleService,
    uiService: BillingCycleUiService
  ) {
    super(fb, ref, service, uiService);
  }

  dates = signal<Date[]>([setDate(new Date(), 1), endOfMonth(new Date())]);
  isBillingCycleEdit = signal<boolean>(false);
  isBillingCycleRemove = signal<boolean>(false);

  override initControl(): void {
    const {
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      dates: [this.dates(), [required]],
      note: [null, [noteMaxLengthValidator]],
    });
  }

  override onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading()) {
      let model = {
        ...this.frm.getRawValue(),
        startDate: this.frm.getRawValue().dates[0],
        endDate: this.frm.getRawValue().dates[1],
      };
      let operation$: Observable<BillingCycle> = this.service.add(model);
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...model,
          id: this.modal?.id,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        this.isLoading.set(true);
        operation$.subscribe({
          next: (result: BillingCycle) => {
            this.model = result;
            this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  override setFormValue(): void {
    this.frm.setValue({
      dates: [this.model.startDate, this.model.endDate],
      note: this.model.note,
    });
  }
}