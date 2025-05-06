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
import { MemberUiService } from "./member-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-room-advanced-filter",
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
          <nz-form-label>{{ "MemberGroup" | translate }}</nz-form-label>
          <nz-form-control>
            <app-member-group-select
              [showAllOption]="true"
              formControlName="memberGroupId"
            ></app-member-group-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ "Sex" | translate }}</nz-form-label>
          <nz-form-control>
            <app-lookup-item-select
              [showAllOption]="true"
              [lookupType]="LOOKUP_TYPE.SexId"
              [typeLabelAll]="'AllSex' | translate"
              formControlName="sexId"
            ></app-lookup-item-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ "Nationality" | translate }}</nz-form-label>
          <nz-form-control>
            <app-lookup-item-select
              [showAllOption]="true"
              [typeLabelAll]="'AllNationality' | translate"
              [lookupType]="LOOKUP_TYPE.Nationality"
              formControlName="nationalityId"
            ></app-lookup-item-select>
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
export class MemberAdvancedFilterComponent implements OnInit {
  constructor(
    public uiService: MemberUiService,
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
      memberGroupId: [null],
      sexId: [null],
      nationalityId: [null],
    });
  }

  resetForm() {
    this.initControl();
  }

  setFormValue(advanced: any) {
    setTimeout(() => {
      this.frm.setValue({
        memberGroupId: advanced?.memberGroupId ?? 0,
        sexId: advanced?.sexId ?? 0,
        nationalityId: advanced?.nationalityId ?? 0,
      });
    }, 50);
  }
  submit() {
    this.setStorageKey(this.isSetFilter());
    this.ref.triggerOk().then();
  }

  isSetFilter(): boolean {
    const defaultZeroFields = ["memberGroupId", "sexId", "nationalityId"];
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
