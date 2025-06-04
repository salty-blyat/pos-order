import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ReportParam } from "./report.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { ReportParamDisplay } from "../../const";
import { DatetimeHelper } from "../../helpers/datetime-helper";

@Component({
  selector: "app-report-filter",
  template: `
    <form nz-form [formGroup]="frm" *ngIf="formItems.length > 0">
      <div nz-row style="display: flex; gap: 4px;">
        <div *ngFor="let item of formItemInline" class="formItemInline">
          <app-report-dynamic-input
            [formItem]="item"
            formControlName="{{ item.key }}"
          ></app-report-dynamic-input>
        </div>
        <div *ngIf="formItemModal.length > 0">
          <button
            nz-button
            nzType="default"
            (click)="isVisible = true"
          >
            <nz-badge [nzDot]="dot">
              <i
                nz-icon
                title="{{ 'AdvancedFilter' | translate }}"
                nzType="align-right"
                nzTheme="outline"
              ></i>
            </nz-badge>
          </button>
        </div>
        <nz-form-item *ngIf="showFilterButton">
          <nz-form-control>
            <button nz-button nzType="default" (click)="submit()">
              <i
                title="{{ 'Search' | translate }}"
                nz-icon
                nzType="filter"
                nzTheme="outline"
              ></i>
            </button>
          </nz-form-control>
        </nz-form-item>
      </div>
      <nz-modal
        [(nzVisible)]="isVisible"
        (nzOnCancel)="isVisible = false"
        nzWidth="400px"
        [nzBodyStyle]="{
          padding: '5px 20px 20px 20px',
          display: 'grid',
          gap: '18px'
        }"
      >
        <div *nzModalTitle>
          <div style="text-align: center">
            <h4 style="font-weight: 600">
              {{ "AdvancedFilter" | translate }}
            </h4>
          </div>
        </div>
        <ng-container *nzModalContent>
          <div style="margin-bottom: -5px" *ngFor="let item of formItemModal">
            <app-report-dynamic-input
              [formItem]="item"
              formControlName="{{ item.key }}"
            ></app-report-dynamic-input>
          </div>
        </ng-container>
        <div *nzModalFooter>
          <div nz-row nzJustify="space-between">
            <button nz-button nzType="default" nzDanger (click)="resetForm()">
              <i nz-icon nzType="undo" nzTheme="outline"></i
              >{{ "ResetFilter" | translate }}
            </button>
            <button nz-button nzType="default" (click)="submit()">
              <i nz-icon nzType="filter" nzTheme="outline"></i
              >{{ "Search" | translate }}
            </button>
          </div>
        </div>
      </nz-modal>
    </form>
  `,
  styles: [
    `
      [nz-form] {
        padding-top: 0px;
      }
      [nz-form] {
        .ant-form-item {
          margin-bottom: 0px !important;
        }
      }
      ::ng-deep .ant-select-multiple .ant-select-selector {
        padding: 1px 5px;
        bottom: 0;
      }
      .formItemInline {
        min-width: 220px !important;
      }
    `,
  ],
  standalone: false,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReportFilterComponent implements OnInit, AfterViewInit {
  constructor(private fb: FormBuilder) {}

  @Output() onSubmit = new EventEmitter<any>();
  @Input() showFilterButton: boolean = true;
  @Input() formItems: ReportParam[] = [];
  isVisible = false;
  formItemInline: ReportParam[] = [];
  formItemModal: ReportParam[] = [];
  frm!: FormGroup;
  dot = false;
  fields: string[] = [];
  ngOnInit(): void {
    this.formItemInline = this.formItems.filter(
      (item) => item.display == ReportParamDisplay.Inline
    );
    this.formItemModal = this.formItems.filter(
      (item) => item.display === ReportParamDisplay.Modal
    );
    this.initControl();
    this.submit();
  }

  initControl() {
    const { required } = CommonValidators;
    this.frm = this.fb.group({});
    for (let formItem of this.formItems) {
      let defaultValue = formItem.defaultValue;
      if (typeof defaultValue == "string") {
        try {
          defaultValue = JSON.parse(defaultValue);
        } catch (e) {}
      }

      // Change prop name from value to id
      try {
        if (Array.isArray(defaultValue)) {
          defaultValue = defaultValue.map((x) => {
            return { id: Object.values(x)[0], label: Object.values(x)[1] };
          });
        } else {
          defaultValue = {
            id: Object.values(defaultValue)[0],
            label: Object.values(defaultValue)[1],
          };
        }
      } catch (e) {}

      if (Array.isArray(defaultValue)) {
        for (let value of defaultValue) {
          if (!value?.id) {
            value = { id: "0", label: "" };
          }
        }
        let ids = defaultValue.map((x) => x.id).join();
        let label = defaultValue.map((x) => x.label).join();
        defaultValue = { id: ids, label: label };
      } else {
        if (!defaultValue?.id) {
          defaultValue = { id: "0", label: "" };
        }
      }

      //Initial default value for date if no have in session
      if (formItem.type == "Date") {
        if (defaultValue.id == "0") {
          defaultValue = {
            id: new Date().toISOString(),
            label: DatetimeHelper.toShortDateString(new Date()),
          };
        }
      }
      //Initial default value for dateRange if no have in session
      if (formItem.type == "DateRange") {
        if (defaultValue.id == "0") {
          defaultValue = {
            id: `${new Date().toISOString()},${new Date().toISOString()}`,
            label: `${DatetimeHelper.toShortDateString(
              new Date()
            )}~${DatetimeHelper.toShortDateString(new Date())}`,
          };
        }
      }
      //Initial default value for branches if no have in session
      if (formItem.type == "Branches") {
        // if (
        //   defaultValue.id == '0' &&
        //   !this.authService.isAuthorized(
        //     AuthKeys.POS_ADM__SETTING__BRANCH__LIST_ALL_BRANCH
        //   )
        // ) {
        //   defaultValue = {
        //     id: this.branch?.id,
        //     label: this.branch?.name,
        //   };
        // }
      }

      this.frm.addControl(
        formItem.key || "",
        this.fb.control(defaultValue, [required])
      );
      this.fields.push(formItem.key!);
    }
  }
  submit() {
    this.onSubmit.emit(this.frm.value);

    for (let item of this.fields) {
      if (this.formItemModal.find((x) => x.key == item)) {
        if (this.frm.get(item)?.value.id !== "0") {
          this.dot = true;
          break;
        }
      } else {
        this.dot = false;
      }
    }
    this.isVisible = false;
  }
  resetForm() {
    // Work only with muti select component
    this.formItemModal.forEach((item) => {
      this.frm.controls[item.key || ""].setValue([0]);
      // if (
      //   item.type === 'Branches' &&
      //   !this.authService.isAuthorized(
      //     AuthKeys.POS_ADM__SETTING__BRANCH__LIST_ALL_BRANCH
      //   )
      // ) {
      //   this.frm.controls[item.key || ''].setValue([this.branch?.id]);
      // } else this.frm.controls[item.key || ''].setValue([0]);
    });
    this.submit();
  }

  ngAfterViewInit(): void {}
}
