import {Component, signal, ViewEncapsulation} from "@angular/core";
import {BaseOperationComponent} from "../../utils/components/base-operation.component";
import {RoomInventory, RoomInventoryService} from "./room-inventory.service";
import {RoomInventoryUiService} from "./room-inventory-ui.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder} from "@angular/forms";
import {CommonValidators} from "../../utils/services/common-validators";

@Component({
  selector: 'app-room-inventory-operation',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView">
            {{ "Edit" | translate }} {{ model?.roomId || ("Loading" | translate) }}
          </span>
          <span *ngIf="modal?.id && modal?.isView">
            {{ model?.roomId || ("Loading" | translate) }}
        </span>
      </div>

      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "Item" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <app-item-select formControlName="itemId"></app-item-select>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "Qty" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="qty"/>
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
              <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!isLoading() && isRoomInventoryEdit()">
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isRoomInventoryEdit()"></nz-divider>
              <a nz-typography nzType="danger" (click)="uiService.showDelete(model.id || 0)" *ngIf="!isLoading() && isRoomInventoryRemove()">
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider nzType="vertical" *ngIf="!isLoading() && isRoomInventoryRemove()"></nz-divider>
              <a nz-typography (click)="cancel()" style="color: gray;">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Close" | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RoomInventoryOperationComponent extends BaseOperationComponent<RoomInventory>{
  constructor(
    service: RoomInventoryService,
    uiService: RoomInventoryUiService,
    ref: NzModalRef<RoomInventoryOperationComponent>,
    fb: FormBuilder,
  ) {
    super(fb, ref, service, uiService);
  }
  isRoomInventoryEdit = signal<boolean>(false);
  isRoomInventoryRemove = signal<boolean>(false);
  override initControl(): void {
    const {
      required,
    } = CommonValidators;
    this.frm = this.fb.group({
      roomId: [this.modal?.roomId, [required]],
      itemId: [null, [required]],
      qty: [null, [required]],
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      roomId: this.model.roomId,
      itemId: this.model.itemId,
      qty: this.model.qty,
    });
  }
}