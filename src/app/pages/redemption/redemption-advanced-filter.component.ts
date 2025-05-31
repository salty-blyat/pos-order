import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { RedemptionUiService } from "./redemption-ui.service";

@Component({
  selector: "app-redemption-advanced-filter",
  template: `
    <div *nzModalTitle>
      <div>
        <h4>{{ "AdvancedFilter" | translate }}</h4>
      </div>
    </div>
    <div class="modal-content">
      <app-loading *ngIf="isLoading()"> </app-loading>
      <form
        nzLayout="vertical"
        style="padding-top: 4px;"
        nz-form
        [formGroup]="frm"
      >
        <nz-form-item>
          <nz-form-label>{{ "OfferType" | translate }}</nz-form-label>
          <nz-form-control>
            <app-lookup-item-select
              showAll="AllOfferType"
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.OfferType"
              formControlName="offerTypeId"
            >
            </app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ "AccountType" | translate }}</nz-form-label>
          <nz-form-control>
            <app-lookup-item-select
              showAll="AllAccountType"
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.AccountType"
              formControlName="accountTypeId"
            ></app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ "Status" | translate }}</nz-form-label>
          <nz-form-control>
            <app-lookup-item-select
              showAll="AllStatus"
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.RedeemStatus"
              formControlName="statusId"
            ></app-lookup-item-select>
          </nz-form-control> </nz-form-item
        ><nz-form-item>
          <nz-form-label>{{ "Location" | translate }}</nz-form-label>
          <nz-form-control>
            <app-location-select
              showAll="AllLocation"
              [showAllOption]="true"
              formControlName="locationId"
            ></app-location-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-row nzJustify="space-between">
        <button nz-button nzType="default" nzDanger (click)="resetForm()">
          <i nz-icon nzType="undo" nzTheme="outline"></i>
          {{ "ResetFilter" | translate }}
        </button>
        <button nz-button nzType="default" (click)="submit()">
          <i nz-icon nzType="filter" nzTheme="outline"></i>
          {{ "Search" | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .ant-form-item-label {
        padding-bottom: 2px !important;
        > label {
          font-size: 13px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    `,
  ],
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RedemptionAdvancedFilterComponent implements OnInit {
  constructor(
    public uiService: RedemptionUiService,
    private ref: NzModalRef,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder
  ) {}

  frm!: FormGroup;
  readonly modal = inject(NZ_MODAL_DATA);
  isLoading = signal<boolean>(false);
  storageKey: string = this.modal?.storageKey;

  ngOnInit() {
    let advancedFilter = this.sessionStorageService.getValue(this.storageKey);
    this.initControl();
    this.setFormValue(advancedFilter);
  }
  private initControl() {
    this.frm = this.fb.group({
      offerTypeId: [null],
      accountTypeId: [null],
      statusId: [null],
      locationId: [null],
    });
  }

  resetForm() {
    this.frm.reset({
      offerTypeId: 0,
      locationId: 0,
      accountTypeId: 0,
      statusId: 0,
    });
    this.submit();
  }

  setFormValue(advanced: any) {
    this.frm.setValue({
      offerTypeId: advanced?.offerTypeId ?? 0,
      accountTypeId: advanced?.accountTypeId ?? 0,
      statusId: advanced?.statusId ?? 0,
      locationId: advanced?.locationId ?? 0,
    });
  }
  submit() {
    this.setStorageKey(this.isSetFilter());
    this.ref.triggerOk().then();
  }

  isSetFilter(): boolean {
    const defaultZeroFields = [
      "offerTypeId",
      "accountTypeId",
      "statusId",
      "locationId",
    ];
    return defaultZeroFields.some((field) => this.frm.value[field] !== 0);
  }
  setStorageKey(isAdvancedFilter: boolean) {
    this.sessionStorageService.setValue({
      key: this.storageKey,
      value: { ...this.frm.getRawValue(), isAdvancedFilter: isAdvancedFilter },
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
