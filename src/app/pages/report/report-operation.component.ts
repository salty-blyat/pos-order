import {Component, Input, OnInit, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CommonValidators } from '../../utils/services/common-validators';
import {
  Report,
  ReportParam,
  ReportService,
  TAB_INDEX_REPORT,
} from './report.service';
import { ReportUiService } from './report-ui.service';
import {
  Orientation,
  PageSize,
  ReportParamDisplay,
} from '../../const';
import { AuthService } from '../../helpers/auth.service';
import { LookupMultipleSelectComponent } from '../lookup/lookup-item/lookup-multiple-select.component';
import { StaticDropdownMultipleSelectComponent } from './static-dropdown-multiple-select.component';
import { StaticDropdownSingleSelectComponent } from './static-dropdown-single-select.component';
import { DateRangeInputReportComponent } from '../../utils/components/date-range-input-report.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { timer } from 'rxjs';
import { NotificationService } from '../../utils/services/notification.service';


export let ParamSelectComponent = {
  StatusType: LookupMultipleSelectComponent,
  StaticDropdownMultipleSelect: StaticDropdownMultipleSelectComponent,
  StaticDropdownSingleSelect: StaticDropdownSingleSelectComponent,
  DateRange: DateRangeInputReportComponent,

};

@Component({
    selector: 'app-report-operation',
    template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal.id">{{ 'Add' | translate }}</span>
      <span *ngIf="modal.id && !modal.isView"
        >{{ 'Edit' | translate }}
        {{ model.name || ('loading' | translate) }}</span
      >
      <span *ngIf="modal.id && modal.isView">{{
        model.name || ('Loading' | translate)
      }}</span>
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="loading"
        style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <form
        nz-form
        [formGroup]="frm"
        [nzAutoTips]="autoTips"
        style="padding-right: 15px;padding-left: 15px; padding-top: 0 !important;"
      >
        <nz-tabset (nzSelectedIndexChange)="onTabChange($event)">
          <nz-tab [nzTitle]="generalTitle">
            <ng-template #generalTitle>
              {{ 'General' | translate }}
            </ng-template>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                'Name' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                'Label' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <input nz-input formControlName="label" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                'Permission Key' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <div nz-row style="align-items: center">
                  <div nz-col [nzSpan]="11">
                    <nz-input-number
                      formControlName="permissionKey"
                    ></nz-input-number>
                  </div>
                  <div nz-col [nzSpan]="12" [nzOffset]="1">
                    <label nz-checkbox formControlName="isHidden">{{
                      'Hidden' | translate
                    }}</label>
                  </div>
                </div>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                'Report Group' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <app-report-group-select
                  formControlName="reportGroupId"
                ></app-report-group-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item formGroupName="printOption">
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                'Paper Format' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <div nz-row>
                  <div nz-col [nzSpan]="11">
                    <nz-select formControlName="pageSize">
                      <nz-option
                        [nzValue]="printOption.pageSize.A1"
                        nzLabel="A1"
                      ></nz-option>
                      <nz-option
                        [nzValue]="printOption.pageSize.A2"
                        nzLabel="A2"
                      ></nz-option>
                      <nz-option
                        [nzValue]="printOption.pageSize.A3"
                        nzLabel="A3"
                      ></nz-option>
                      <nz-option
                        [nzValue]="printOption.pageSize.A4"
                        nzLabel="A4"
                      ></nz-option>
                      <nz-option
                        [nzValue]="printOption.pageSize.A5"
                        nzLabel="A5"
                      ></nz-option>
                    </nz-select>
                  </div>
                  <div nz-col [nzSpan]="12" [nzOffset]="1">
                    <nz-select formControlName="orientation">
                      <nz-option
                        [nzValue]="printOption.orientation.Portrait"
                        nzLabel="Portrait"
                      ></nz-option>
                      <nz-option
                        [nzValue]="printOption.orientation.Landscape"
                        nzLabel="Landscape"
                      ></nz-option>
                    </nz-select>
                  </div>
                </div>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24">{{
                'Note' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <textarea
                  nz-input
                  type="text"
                  formControlName="note"
                  rows="5"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </nz-tab>

          <nz-tab [nzTitle]="paramTitle">
            <ng-template #paramTitle>
              {{ 'Filter' | translate }}
            </ng-template>
            <nz-modal
              [(nzVisible)]="paramFrmModal.isVisible"
              nzWidth="440px"
              [nzMaskClosable]="false"
              (nzOnCancel)="cancelParamFrmModal()"
            >
              <div *nzModalTitle>
                <span *ngIf="!modal.id">{{ 'Add' | translate }}</span>
                <span *ngIf="modal.id && !modal.isView"
                  >{{ 'Edit' | translate }}
                  {{ model.name || ('Loading' | translate) }}</span
                >
                <span *ngIf="modal.id && modal.isView">{{
                  model.name || ('Loading' | translate)
                }}</span>
              </div>
              <div *nzModalContent>
                <form nz-form [formGroup]="paramFrm" [nzAutoTips]="autoTips">
                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                      'Key' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="key" />
                    </nz-form-control>
                  </nz-form-item>
                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24">{{
                      'Label' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="label" />
                    </nz-form-control>
                  </nz-form-item>

                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                      'Display Format' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <nz-select formControlName="display">
                        <nz-option
                          [nzValue]="paramDisplay.Inline"
                          nzLabel="Inline"
                        ></nz-option>
                        <nz-option
                          [nzValue]="paramDisplay.Modal"
                          nzLabel="Modal"
                        ></nz-option>
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                      'Type' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <nz-select formControlName="type">
                        <ng-container
                          *ngFor="let component of paramSelectComponent"
                        >
                          <nz-option
                            [nzValue]="component.value"
                            [nzLabel]="component.label"
                          ></nz-option>
                        </ng-container>
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24">{{
                      'Default Value' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="defaultValue" />
                    </nz-form-control>
                  </nz-form-item>
                  <nz-form-item>
                    <nz-form-label [nzSm]="7" [nzXs]="24">{{
                      'Init Param' | translate
                    }}</nz-form-label>
                    <nz-form-control [nzSm]="14" [nzXs]="24">
                      <textarea
                        nz-input
                        formControlName="initParam"
                        rows="1"
                      ></textarea>
                    </nz-form-control>
                  </nz-form-item>
                </form>
              </div>
              <div *nzModalFooter>
                <div>
                  <button
                    nz-button
                    nzType="primary"
                    [disabled]="!paramFrm.valid"
                    (click)="
                      paramFrmOperation(
                        paramFrmModal.operation,
                        paramFrmModal.index
                      )
                    "
                  >
                    <i *ngIf="loading" nz-icon nzType="loading"></i>
                    {{ 'Save' | translate }}
                  </button>
                  <button
                    nz-button
                    nzType="default"
                    (click)="cancelParamFrmModal()"
                  >
                    {{ 'Cancel' | translate }}
                  </button>
                </div>
              </div>
            </nz-modal>
            <cdk-virtual-scroll-viewport
              itemSize="50"
              [ngStyle]="{ height: isView ? '365px' : 'calc(100vh - 240px)' }"
            >
              <div
                cdkDropList cdkDropListLockAxis="y"
                (cdkDropListDropped)="drop($event)"
                style="margin-right: 5px"
              >
                <!--              <div style="margin-right: 5px">-->
                <div
                  [ngStyle]="{
                    'background-color': isView ? '#f5f5f5' : '#E6F7FF',
                    'border-left': isView
                      ? '3px solid #C0C0C0'
                      : '3px solid #1890ff'
                  }"
                  style="padding: 10px; border-radius: 6px; margin-bottom: 10px; cursor: move;"
                  *ngFor="let element of paramFrmArray?.value; let i = index"
                  cdkDrag
                >
                  <div nz-row nzJustify="space-between">
                    <div>
                      <div nz-row nzAlign="middle">
                        <h3 style="margin: 0">
                          {{ element.label | translate }}
                        </h3>
                        <nz-divider
                          nzType="vertical"
                          *ngIf="element.label"
                          style="border-left: 2px solid rgba(0, 0, 0, 0.06);; height: 20px"
                        ></nz-divider>
                        <h3 style="margin: 0">{{ element.key }}</h3>
                      </div>
                      <span style="color: rgba(0,0,0,.65)">{{
                        element.type
                      }}</span>
                    </div>
                    <div>
                      <a
                        nz-button
                        nzType="link"
                        style="padding: 0"
                        (click)="showParamFrmModal('View', i, element)"
                      >
                        <i nz-icon nzType="eye" nzTheme="outline"></i>
                      </a>
                      <nz-divider nzType="vertical"></nz-divider>
                      <a
                        *ngIf="!isView"
                        nz-button
                        nzType="link"
                        style="padding: 0"
                        (click)="showParamFrmModal('Edit', i, element)"
                      >
                        <i nz-icon nzType="edit" nzTheme="outline"></i>
                      </a>
                      <nz-divider nzType="vertical"></nz-divider>
                      <a
                        *ngIf="!isView"
                        nz-button
                        nzType="link"
                        style="padding: 0"
                        nzDanger
                        (click)="paramFrmOperation('Delete', i)"
                      >
                        <i nz-icon nzType="close" nzTheme="outline"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  *ngIf="!isView"
                  nz-button
                  nzType="dashed"
                  class="buttonAddfilter"
                  (click)="showParamFrmModal('Add')"
                >
                  <i nz-icon nzType="plus"></i>
                  {{ 'Add' | translate }}
                </button>
              </div>
            </cdk-virtual-scroll-viewport>
          </nz-tab>

          <nz-tab [nzTitle]="templateTitle">
            <ng-template #templateTitle>
              {{ 'Template' | translate }}
            </ng-template>
            <nz-form-item>
              <nz-form-control [nzSm]="24" [nzXs]="24">
                <app-code-editor
                  #codeEditorTemplate
                  [language]="'html'"
                  formControlName="template"
                ></app-code-editor>
              </nz-form-control>
            </nz-form-item>
          </nz-tab>

          <nz-tab [nzTitle]="commandTitle">
            <ng-template #commandTitle>
              {{ 'Command' | translate }}
            </ng-template>
            <nz-form-item>
              <nz-form-control [nzSm]="24" [nzXs]="24">
                <app-code-editor
                  #codeEditorCommand
                  [language]="'sql'"
                  formControlName="command"
                ></app-code-editor>
              </nz-form-control>
            </nz-form-item>
          </nz-tab>
        </nz-tabset>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid"
          (click)="onSubmit()"
        >
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ 'Save' | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ 'Cancel' | translate }}
        </button>
      </div>
      <div *ngIf="isView">
        <a
          nz-typography
          (click)="uiService.showEdit(model.id || 0)"
          *ngIf="!loading && isReportEdit"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Edit' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isReportEdit"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isReportRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Delete' | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!loading && isReportRemove"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ 'Close' | translate }}</span>
        </a>
      </div>
    </div>
  `,
    styleUrls: ['../../../assets/scss/operation.style.scss'],
    styles: [
        `
      :host ::ng-deep .ant-tabs-tab {
        margin-right: 32px !important;
      }
      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

      .cdk-drag-placeholder {
        opacity: 0;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      ::ng-deep .ant-tabs-tab {
        margin: 0 32px 0 0 !important;
      }
      ::ng-deep .ant-checkbox + span {
        color: #5b5b5b;
      }
      ::ng-deep .ant-input-number-disabled .ant-input-number-input {
        color: #5b5b5b;
      }
      .buttonAddfilter {
        width: 100%;
        height: 50px;
        position: sticky;
        bottom: 0px;
      }
    `,
    ],
    standalone: false,
    encapsulation: ViewEncapsulation.None
})
export class ReportOperationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ref: NzModalRef<ReportOperationComponent>,
    private service: ReportService,
    public uiService: ReportUiService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  readonly modal = inject(NZ_MODAL_DATA);
  // @Input() id: number = 0;
  @Input() isView: boolean = false;
  @ViewChild('codeEditorTemplate', { static: false }) codeEditorTemplate?: any;
  @ViewChild('codeEditorCommand', { static: false }) codeEditorCommand?: any;
  printOption = { pageSize: PageSize, orientation: Orientation };
  paramDisplay = ReportParamDisplay;
  model: Report = {};
  loading = false;
  refreshSub$: any;
  autoTips = CommonValidators.autoTips;
  frm!: FormGroup;
  paramFrm!: FormGroup;
  paramFrmModal: { isVisible: boolean; operation: string; index: number } = {
    isVisible: false,
    operation: 'Add',
    index: -1,
  };
  paramSelectComponent: { value: any; label: any }[] = Object.keys(
    ParamSelectComponent
  ).map((x) => {
    return { value: x, label: x };
  });
  isReportEdit: boolean = true;
  isReportRemove: boolean = true;
  type: any;

  ngOnInit(): void {
    // this.isReportEdit = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT__EDIT
    // );
    // this.isReportRemove = this.authService.isAuthorized(
    //   AuthKeys.POS_ADM__SETTING__REPORT__REMOVE
    // );

    this.initControl();
    if (this.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key == 'edited') {
          this.loading = true;
          this.service.find(this.modal.id).subscribe(
            (result: Report) => {
              this.loading = false;
              this.model = result;
              this.setFormValue();
            },
            (error: any) => {
              console.log(error);
            }
          );
        } else {
          this.cancel();
        }
      });
    }
    if (this.modal.id) {
      this.loading = true;
      this.service.find(this.modal.id).subscribe((result: Report) => {
        this.loading = false;
        this.model = result;
        this.setFormValue();
      });
    }
  }

  initControl() {
    const {
      nameExistValidator,
      nameMaxLengthValidator,
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal.id)],
      ],
      note: [null, [noteMaxLengthValidator()]],
      label: [null, [required]],
      template: [null],
      command: [null],
      isHidden: [false],
      permissionKey: [null, [required]],
      reportGroupId: [null, [required]],
      //sub form
      printOption: this.fb.group({
        pageSize: [null, required],
        orientation: [null, required],
      }),
      params: this.fb.array([]),
    });
    this.paramFrm = this.getParamControl();

    this.frm.patchValue({ reportGroupId: this.modal?.reportGroupId });
  }

  getParamControl(model: ReportParam = {}) {
    const { required } = CommonValidators;
    return this.fb.group({
      key: [model.key, [required]],
      label: [model.label],
      type: [model.type, [required]],
      defaultValue: [model.defaultValue],
      display: [model.display, [required]],
      initParam: [model.initParam],
    });
  }
  paramFrmOperation(operation: string, index: number = -1) {
    console.log(this.paramFrmArray.value);

    if (operation == 'Add') {
      this.paramFrmArray.push(this.getParamControl(this.paramFrm.value));
    } else if (operation == 'Edit') {
      this.paramFrmArray.at(index).patchValue(this.paramFrm.value);
    } else if (operation == 'Delete') {
      this.paramFrmArray.removeAt(index);
    }
    this.cancelParamFrmModal();
  }
  showParamFrmModal(
    operation: string,
    index: number = -1,
    element?: ReportParam
  ) {
    let setValue = element
      ? this.paramFrmArray.value.find((x: any) => x.key == element?.key)
      : null;
    this.paramFrmModal.isVisible = true;
    this.paramFrmModal.operation = operation;
    this.paramFrm.enable();
    if (operation == 'Add') {
      this.paramFrmModal.index = -1;
    } else if (operation == 'Edit') {
      this.paramFrm.setValue(setValue);
      this.paramFrmModal.index = index;
    } else if (operation == 'View') {
      this.paramFrm.setValue(setValue);
      this.paramFrm.disable();
      this.paramFrmModal.index = index;
    }
  }

  onTabChange(index: number) {
    switch (index) {
      case TAB_INDEX_REPORT.TEMPLATE:
        timer(50).subscribe(() => {
          this.codeEditorTemplate?.ngOnInit();
        });
        break;
      case TAB_INDEX_REPORT.COMMAND:
        timer(50).subscribe(() => {
          this.codeEditorCommand?.ngOnInit();
        });
        break;
    }
  }

  onSubmit() {
    if (this.frm.valid && !this.loading) {
      this.loading = true;
      let operation$ = this.service.add(this.frm.value);
      if (this.modal.id) {
        operation$ = this.service.edit({ ...this.frm.value, id: this.modal.id });
      }
      operation$.subscribe({
        next: (result: Report) => {
          this.loading = false;
          this.model = result;
          this.notificationService.updateNotification('Successfully Updated');
          console.log(this.modal.id, this.modal);

          if (!this.modal.id) {
            this.ref.triggerOk();
          } else {
            this.uiService.refresher.emit();
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }

  cancel() {
    this.ref.triggerOk().then();
    this.ref.triggerCancel().then();
  }
  cancelParamFrmModal() {
    this.paramFrmModal = { isVisible: false, operation: 'Add', index: -1 };
    this.paramFrm.reset();
  }

  setFormValue() {
    this.frm.patchValue({
      name: this.model.name,
      note: this.model.note,
      label: this.model.label,
      template: this.model.template,
      isHidden: this.model.isHidden,
      permissionKey: this.model.permissionKey,
      reportGroupId: this.model.reportGroupId,
      printOption: this.model.printOption,
      command: this.model.command,
    });
    this.model.params?.forEach((x) => {
      this.paramFrmArray.push(this.getParamControl(x));
    });
  }

  get paramFrmArray() {
    return this.frm.get('params') as FormArray;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.paramFrmArray.value,
      event.previousIndex,
      event.currentIndex
    );
  }
}
