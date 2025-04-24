import { Component, OnInit } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { ItemType, ItemTypeService } from "./item-type.service";
import { FormBuilder } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { ItemTypeUiService } from "./item-type-ui.service.component";
import { SettingService } from "../../app-setting";
import { CommonValidators } from "../../utils/services/common-validators";

@Component({
  selector: "app-item-type-operation",
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
      <div class="modal-content">
          <nz-spin
                  *ngIf="isLoading"
                  style="position: absolute; top: 50%; left: 50%"
          ></nz-spin>
          <form
                  nz-form
                  [formGroup]="frm"
                  (ngSubmit)="onSubmit()"
                  [nzAutoTips]="autoTips"
          >
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          "Name" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                      <input nz-input formControlName="name"/>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24">{{
                          "Note" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="17" [nzXs]="24">
            <textarea
                    nz-input
                    rows="3"
                    formControlName="note"
                    style="width: 100%;"
            ></textarea>
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
                  <i *ngIf="isLoading" nz-icon nzType="loading"></i>
                  {{ "Save" | translate }}
              </button>
              <button nz-button nzType="default" (click)="cancel()">
                  {{ "Cancel" | translate }}
              </button>
          </div>
          <div *ngIf="modal?.isView">
              <a
                      (click)="uiService.showEdit(model.id || 0)"
                      *ngIf="!isLoading && isItemTypeEdit"
              >
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading && isItemTypeEdit"
              ></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading && isItemTypeRemove"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading && isItemTypeRemove"
              ></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Close" | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ["../../../assets/scss/operation_page.scss"],
  standalone: false,
})
export class ItemTypeOperationComponent extends BaseOperationComponent<ItemType> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<ItemTypeOperationComponent>,
    override service: ItemTypeService,
    override uiService: ItemTypeUiService,
    private settingService: SettingService
  ) {
    super(fb, ref, service, uiService);
  }

  isItemTypeEdit: boolean = true;
  isItemTypeRemove: boolean = true;

  override initControl(): void {
    const {
      required,
      nameExistValidator,
      noteMaxLengthValidator,
      codeExistValidator,
    } = CommonValidators;

    this.frm = this.fb.group({
      name: [
        null,
        [required, noteMaxLengthValidator()],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      note: [null, [noteMaxLengthValidator()]],
    });
  }

  override setFormValue() {
    this.frm.setValue({
      name: this.model.name,
      note: this.model.note,
    });
  }
}
