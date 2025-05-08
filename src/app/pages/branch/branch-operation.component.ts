import { Component, signal, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Branch, BranchService, User } from "./branch.service";
import { BranchUiService } from "./branch-ui.service";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { AuthService } from "../../helpers/auth.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { SIZE_COLUMNS } from "../../const";

@Component({
  selector: "app-branch-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView"
        >{{ "Edit" | translate }}
        {{ model?.name || ("Loading" | translate) }}</span
      >
      <span *ngIf="modal?.id && modal?.isView">{{
        model?.name || ("Loading" | translate)
      }}</span>
    </div>
    <div class="modal-content" style="height:400px">
      <app-loading *ngIf="isLoading()" />
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
        style="padding-top: 0;"
      >
        <nz-tabset style="margin:0 8px;">
          <nz-tab [nzTitle]="titleDetail" style="margin-right:8px;">
            <ng-template #titleDetail>
              <span nz-icon nzType="info-circle"></span>
              {{ "Branch" | translate }}
            </ng-template>

            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                "Code" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="code" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                "Name" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                "Phone" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="17" [nzXs]="24">
                <input nz-input formControlName="phone" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                "Address" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
                <textarea
                  nz-input
                  formControlName="address"
                  rows="3"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24">{{
                "Note" | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
                <textarea nz-input formControlName="note" rows="3"></textarea>
              </nz-form-control>
            </nz-form-item>
          </nz-tab>

          <nz-tab [nzTitle]="titleUser">
            <ng-template #titleUser>
              <span nz-icon nzType="user"></span>
              {{ "Users" | translate }}
            </ng-template>

            <!-- <div class="filter-box" style="margin-bottom: 8px">
              <app-filter-input
                storageKey="branch-list-search"
              ></app-filter-input>
            </div> -->

            <nz-table
              nzSize="small"
              #fixedTable
              [nzData]="usernames.controls"
              nzTableLayout="fixed"
              [nzFrontPagination]="false"
              [nzNoResult]="noResult"
              [nzFooter]="addNewEducation"
              style="padding: 0 8px;"
            >
              <ng-template #noResult> </ng-template>
              <ng-template #addNewEducation>
                <a
                  (click)="uiService.showUserPopupSelect(usernames.value)"
                  nz-button
                  nzBlock
                  nzType="link"
                  [disabled]="modal?.isView"
                >
                  <i nz-icon nzTheme="outline" nzType="plus"></i>
                  {{ "Add" | translate }}
                </a>
              </ng-template>
              <thead>
                <tr>
                  <th nzWidth="35px">#</th>
                  <th nzWidth="40px"></th>
                  <th>{{ "Name" | translate }}</th>
                  <th>{{ "Username" | translate }}</th>
                  <th nzWidth="35px"></th>
                </tr>
              </thead>
              <tbody formArrayName="userNames">
                <ng-container
                  *ngFor="let username of usernames.controls; let i = index"
                >
                  <tr [formGroupName]="i">
                    <td nzEllipsis>{{ i + 1 }}</td>
                    <td>
                      <nz-avatar
                        [nzSrc]="username.value['profile']"
                        nzIcon="user"
                      ></nz-avatar>
                    </td>
                    <td nzEllipsis class="pl-6">
                      {{ username.value["fullName"] }}
                    </td>
                    <td nzEllipsis class="pl-6">
                      {{ username.value["name"] }}
                    </td>
                    <td style="text-align: center;">
                      <a
                        style="color:{{ modal?.isView ? 'gray' : 'red' }};"
                        (click)="removeFormList(i)"
                        nz-button
                        [disabled]="modal?.isView"
                        nzType="link"
                      >
                        <span nz-icon nzType="delete"></span>
                      </a>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </nz-table>
          </nz-tab>
        </nz-tabset>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button
          nz-button
          nzType="primary"
          [disabled]="!frm.valid || isLoading()"
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
          *ngIf="!isLoading() && isBranchEdit()"
        >
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isBranchEdit()"
        ></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!isLoading() && isBranchDelete()"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider
          nzType="vertical"
          *ngIf="!isLoading() && isBranchDelete()"
        ></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .ant-modal-body {
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      ::ng-deep .ant-tabs-tab {
        padding-bottom: 5px;
        margin-right: 16px;
      }
      ::ng-deep .ant-table-thead > tr > th,
      .ant-table-tbody > tr > td,
      .ant-table tfoot > tr > th,
      .ant-table tfoot > tr > td {
        padding: 2px;
      }
      .pl-6 {
        padding-left: 8px !important;
      }
    `,
  ],
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class BranchOperationComponent extends BaseOperationComponent<Branch> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<BranchOperationComponent>,
    override service: BranchService,
    override uiService: BranchUiService,
    private authService: AuthService
  ) {
    super(fb, ref, service, uiService);
  }
  readonly SIZE_COLUMNS = SIZE_COLUMNS;

  listOfUsers: User[] = [];
  isBranchEdit = signal<boolean>(true);
  isBranchDelete = signal<boolean>(true);

  override ngOnInit(): void {
    super.ngOnInit();
    this.uiService.refresher.subscribe((user) => {
      if (user.key === "addUser") {
        this.usernames.clear();
        user.value?.map((value: any) => {
          this.addUsername(value);
        });
      }
    });
  }

  get usernames(): FormArray {
    return this.frm.get("userNames") as FormArray;
  }

  override initControl(): void {
    const {
      required,
      codeMaxLengthValidator,
      codeExistValidator,
      nameMaxLengthValidator,
      nameExistValidator,
      noteMaxLengthValidator,
      multiplePhoneValidator,
      phoneExistValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      code: [
        null,
        [required, codeMaxLengthValidator],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator]],
      userNames: this.fb.array([]),
      address: [null, [required]],
      phone: [
        null,
        [required, multiplePhoneValidator],
        [phoneExistValidator(this.service, this.modal?.id)],
      ],
    });
  }

  addUsername(user?: User): void {
    const username = this.fb.group({
      name: [user?.name],
      fullName: [user?.fullName],
      profile: [user?.profile],
    });

    this.usernames.push(username);
  }
  removeFormList(index: number): void {
    this.usernames.removeAt(index);
  }

  override setFormValue(): void {
    this.usernames.clear();
    this.frm.patchValue({
      code: this.model.code,
      name: this.model.name,
      note: this.model.note,
      phone: this.model.phone,
      address: this.model.address,
    });

    if (this.model.userNames) {
      this.model.userNames.map((name) => {
        this.addUsername(name);
      });
    }
  }
}
