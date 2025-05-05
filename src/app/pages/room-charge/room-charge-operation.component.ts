import {Component, input, signal, ViewEncapsulation} from "@angular/core";
import {BaseOperationComponent} from "../../utils/components/base-operation.component";
import {FormBuilder} from "@angular/forms";
import {CommonValidators} from "../../utils/services/common-validators";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ChargeType, LOOKUP_TYPE, RoomChargeStatus} from "../lookup/lookup-type.service";
import {RoomCharge, RoomChargeService} from "./room-charge.service";
import {RoomChargeUiService} from "./room-charge-ui.service";
import {Charge, ChargeService} from "../charge/charge.service";

@Component({
  selector: "app-room-charge-operation",
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
          <span *ngIf="modal?.id && !modal?.isView">
            {{ "Edit" | translate }} {{ model?.chargeName || ("Loading" | translate) }}
          </span>
          <span *ngIf="modal?.id && modal?.isView">
            {{ model?.chargeName || ("Loading" | translate) }}
        </span>
      </div>

      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "Charge" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <app-charge-select formControlName="chargeId"></app-charge-select>
                  </nz-form-control>
              </nz-form-item>
              <nz-form-item *ngIf="isSerial()">
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "MeterSerial" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="meterSerial"/></nz-form-control>
              </nz-form-item>
              <nz-form-item  *ngIf="isSerial()">
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>
                      {{ "StartReading" | translate }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <input nz-input formControlName="startReading"/></nz-form-control>
              </nz-form-item>
              <nz-form-item>
                  <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{
                          "StartDate" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="14" [nzXs]="24">
                      <nz-date-picker formControlName="startDate"></nz-date-picker>
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
                      *ngIf="!isLoading() && isRoomChargeEdit()"
              >
                  <i nz-icon nzType="edit" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Edit" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isRoomChargeEdit()"
              ></nz-divider>
              <a
                      nz-typography
                      nzType="danger"
                      (click)="uiService.showDelete(model.id || 0)"
                      *ngIf="!isLoading() && isRoomChargeRemove()"
              >
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                  <span class="action-text"> {{ "Delete" | translate }}</span>
              </a>
              <nz-divider
                      nzType="vertical"
                      *ngIf="!isLoading() && isRoomChargeRemove()"
              ></nz-divider>
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
export class RoomChargeOperationComponent extends BaseOperationComponent<RoomCharge> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomChargeOperationComponent>,
    service: RoomChargeService,
    uiService: RoomChargeUiService,
    private chargeService: ChargeService
  ) {
    super(fb, ref, service, uiService);
  }

  isSerial = signal(false);


  isRoomChargeEdit = signal(true);
  isRoomChargeRemove = signal(true);

  override ngOnInit() {
    super.ngOnInit();
      this.frm.get('chargeId')?.valueChanges?.subscribe((result: any) => {
        if (result){
          this.chargeService.find(result).subscribe({
            next: (result: Charge) => {
              if (result.chargeTypeId == ChargeType.Meter){
                this.isSerial.set(true);
              }else {
                this.isSerial.set(false);
              }
              if (!this.modal?.isView){
                this.frm.get('startDate')?.enable();
              }
            },
            error: err => {
              console.log(err)
            }
          })
        }
      });
  }

  override initControl(): void {
    const {
      required,
      noteMaxLengthValidator,
    } = CommonValidators;
    this.frm = this.fb.group({
      roomId: [this.modal?.roomId, [required]],
      chargeId: [null, [required]],
      meterSerial: [null, [required, noteMaxLengthValidator]],
      qty: [1],
      startReading: [0, [required]],
      statusId: [RoomChargeStatus.Active,],
      startDate: [{value: null, disabled: true}, [required]],
    });
  }

  override setFormValue(): void {
    this.frm.setValue({
      roomId: this.model.roomId,
      chargeId: this.model.chargeId,
      meterSerial: this.model.meterSerial,
      qty: this.model.qty,
      startReading: this.model.startReading,
      statusId: this.model.statusId,
      startDate: this.model.startDate,
    });
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
