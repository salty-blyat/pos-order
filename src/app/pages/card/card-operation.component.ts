import { Component, computed, effect, ViewEncapsulation } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../utils/services/common-validators";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { Card, CardService } from "./card.service";
import { CardUiService } from "./card-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { AuthKeys } from "../../const";

@Component({
  selector: "app-card-operation",
  template: ` <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.cardNumber || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.cardNumber || ("Loading" | translate)
      }}</span>
    </div>

    <div class="modal-content">
      <app-loading *ngIf="isLoading()"></app-loading>
      <form
        nz-form
        [formGroup]="frm"
        [style.height.%]="100"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
            >{{ "CardNumber" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
            <input [autofocus]="true" nz-input formControlName="cardNumber" />
          </nz-form-control>
        </nz-form-item>

        @if(!modal.isAdd){
        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired>
            {{ "Status" | translate }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
            <app-lookup-item-select
              formControlName="status"
              [lookupType]="LOOKUP_TYPE.CardStatus"
            >
            </app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        }

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired 
            >{{ "IssueDate" | translate }}
          </nz-form-label>

          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-date-picker formControlName="issueDate" [nzAllowClear]="false"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="8" [nzXs]="24"
            >{{ "ExpiryDate" | translate }}
          </nz-form-label>

          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-date-picker formControlName="expiryDate"></nz-date-picker>
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
          *ngIf="!isLoading() && isCardEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isCardEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isCardRemove()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isCardRemove()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>`,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class CardOperationComponent extends BaseOperationComponent<Card> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<CardOperationComponent>,
    service: CardService,
    private authService: AuthService,
    uiService: CardUiService
  ) {
    super(fb, ref, service, uiService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.modal?.isEdit) {
      this.frm.get("status")?.enable();
    } else {
      this.frm.get("status")?.disable();
    }
  }

  readonly LOOKUP_TYPE = LOOKUP_TYPE; 
  
  isCardRemove = computed(() => this.authService.isAuthorized(AuthKeys.APP__MEMBER__CARD__REMOVE));
  isCardEdit = computed(() => this.authService.isAuthorized(AuthKeys.APP__MEMBER__CARD__EDIT));

  override initControl(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      accountId: [this.modal?.accountId, [required]],
      cardNumber: [null, [required]],
      status: [null, [required]],
      issueDate: [new Date(), [required]],
      expiryDate: [null],
    }); 
  }

  override setFormValue() {
    this.frm.setValue({
      accountId: this.model.accountId,
      cardNumber: this.model.cardNumber,
      status: this.model.status,
      issueDate: this.model.issueDate,
      expiryDate: this.model.expiryDate,
    });
  }
}
