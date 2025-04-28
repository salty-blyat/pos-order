import {Component, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {BaseOperationComponent} from '../../utils/components/base-operation.component';
import {CommonValidators} from '../../utils/services/common-validators';
import {Currency, CurrencyService} from './currency.service';
import {CurrencyUiService} from './currency-ui.service';

@Component({
  selector: 'app-currency-operation',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ 'Add' | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView"
          >{{ 'Edit' | translate }}
              {{ model?.code || ('Loading' | translate) }}</span
          >
          <span *ngIf="modal?.id && modal?.isView">{{
                  model?.code || ('Loading' | translate)
              }}</span>
      </div>
      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form
                  nz-form
                  [formGroup]="frm"
                  [nzAutoTips]="autoTips"
          >
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'Code' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="code"/>
                  </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'Name' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="name"/>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'Symbol' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="symbol"/>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'Format' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24">
                      <input nz-input formControlName="format"/>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'Rounding' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="rounding"/>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          'ExchangeRate' | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="exchangeRate"/>
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
                  {{ 'Save' | translate }}
              </button>
              <button nz-button nzType="default" (click)="cancel()">
                  {{ 'Cancel' | translate }}
              </button>
          </div>
          <div *ngIf="modal?.isView">
              <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!isLoading() && isCurrencyEdit">
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Edit' | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isCurrencyEdit"></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading() && isCurrencyRemove"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Delete' | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isCurrencyRemove"></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Close' | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ['../../../assets/scss/operation.style.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class CurrencyOperationComponent extends BaseOperationComponent<Currency> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<CurrencyOperationComponent>,
    service: CurrencyService,
    uiService: CurrencyUiService,
  ) {
    super(fb, ref, service, uiService);
  }

  isCurrencyEdit: boolean = true;
  isCurrencyRemove: boolean = true;

  override initControl() {
    const {codeExistValidator, nameMaxLengthValidator, required} =
      CommonValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [required, nameMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      symbol: [null, [required, nameMaxLengthValidator]],
      name: [null, [required, nameMaxLengthValidator]],
      format: [null, [required]],
      exchangeRate: [null, [required]],
      rounding: [null, [required]],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      code: this.model.code,
      symbol: this.model.symbol,
      name: this.model.name,
      format: this.model.format,
      rounding: this.model.rounding,
      exchangeRate: this.model.exchangeRate,
    });
  }
}
