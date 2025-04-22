import { Component, inject, OnInit } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { Room, RoomService } from "./room.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { RoomUiService } from "./room-ui.service";
import { CommonValidators } from "../../utils/services/common-validators";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";
import { Observable } from "rxjs";
import { NotificationService } from "../../utils/services/notification.service";

@Component({
  selector: "app-room-operation-add",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ "Add" | translate }}</span>
    </div>

    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <nz-tabset [(nzSelectedIndex)]="selectedTabIndex">
        <nz-tab nzTitle="{{ 'SingleRoom' | translate }}">
          <form nz-form [formGroup]="singleRoomFrm" [nzAutoTips]="autoTips">
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "RoomNumber" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
                <input nz-input formControlName="roomNumber" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "RoomType" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-room-type-select formControlName="roomTypeId" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Floor" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-floor-select formControlName="floorId" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "HouseKeepingStatus" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-lookup-item-select
                  [lookupType]="LOOKUP_TYPE.HouseKeepingStatus"
                  formControlName="houseKeepingStatus"
                />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Status" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-lookup-item-select [lookupType]="LOOKUP_TYPE.Status" formControlName="status" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24">{{ "Tags" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-tag-multiple-select formControlName="tagIds"></app-tag-multiple-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24">{{ "Description" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <textarea nz-input type="text" formControlName="description" rows="3"></textarea>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-tab>
        <nz-tab nzTitle="{{ 'BatchRoom' | translate }}">
          <form nz-form [formGroup]="batchRoomFrm" [nzAutoTips]="autoTips">
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "RoomType" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-room-type-select formControlName="roomTypeId" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Floor" | translate }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
                <app-floor-select formControlName="floorId" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired>{{ "Range" | translate }}</nz-form-label>
              <nz-form-control nzSpan="3" nzErrorTip="" class="mr-2">
                <input nz-input formControlName="prefix" placeholder="Prefix" />
              </nz-form-control>
              <nz-form-control nzSpan="3" nzErrorTip="" class="mr-2">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="startNumber" />
              </nz-form-control>
              <span class="mr-2" style="align-self: center;">to</span>
              <nz-form-control nzSpan="3" nzErrorTip="" class="mr-2">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="endNumber" />
              </nz-form-control>
              <nz-form-control nzSpan="3" nzErrorTip="">
                <input nz-input formControlName="suffix" placeholder="Suffix"/>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-tab>
      </nz-tabset>
    </div>
    <div *nzModalFooter>
      <div>
        <button
          nz-button
          nzType="primary"
          [disabled]="!singleRoomFrm.valid || loading"
          (click)="addSingleRoom($event)"
          *ngIf="selectedTabIndex === 0"
        >
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button
          nz-button
          nzType="primary"
          [disabled]="!batchRoomFrm.valid || loading"
          (click)="addBatchRoom($event)"
          *ngIf="selectedTabIndex === 1"
        >
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation_page.scss"],
  styles: [
    `
      :host ::ng-deep {
        .ant-tabs-tab {
          margin-left: 10px !important;
          padding: 8px 0;
          margin-bottom: 0;
        }

        .ant-tabs-top > .ant-tabs-nav {
          margin-bottom: 10px;
        }
        nz-tabset{
          overflow:hidden;
        }
      }
      .mr-2 {
        margin-right: 8px;
      }
    `,
  ],

  standalone: false,
})
export class RoomOperationAddComponent implements OnInit {
  constructor(
    protected fb: FormBuilder,
    protected ref: NzModalRef<RoomOperationAddComponent>,
    protected service: RoomService,
    protected uiService: RoomUiService,
    private notificationService: NotificationService
  ) { }

  selectedTabIndex = 0;

  singleRoomFrm!: FormGroup;
  batchRoomFrm!: FormGroup;

  readonly modal: any = inject(NZ_MODAL_DATA);
  model!: Room;
  autoTips: Record<any, any> = CommonValidators.autoTips;
  loading = false;

  ngOnInit(): void {
    this.initControl();
  }

  initControl(): void {
    const { required, nameExistValidator, startLessThanEnd } = CommonValidators;
    this.singleRoomFrm = this.fb.group({
      roomNumber: [null, [required], [nameExistValidator(this.service, this.modal?.id, "name")]],
      roomTypeId: [null, [required]],
      floorId: [null, [required]],
      houseKeepingStatus: [null, [required]],
      status: [null, [required]],
      tagIds: [null],
      description: [null],
    });
    this.batchRoomFrm = this.fb.group({
      roomTypeId: [null, [required]],
      floorId: [null, [required]],
      startNumber: [null, [required]],
      endNumber: [null, [required]],
      prefix: [null],
      suffix: [null],
    });
  }

  startLessThanEndValidator(frm: FormGroup) {
    const start = frm.get("startNumber")?.value;
    const end = frm.get("endNumber")?.value;
    if (start !== null && end !== null && start > end) {
      return {
        rangeError: {
          km: "លេខចាប់ផ្តើមមិនអាចធំជាងលេខបញ្ចប់!",
          en: "Start number cannot be greater than end number!",
        },
      };
    }
    return null;
  }

  private submitRoomOperation(operation$: Observable<Room>, e?: any) {
    if (!this.loading && (!e || e.detail === 1 || e.detail === 0)) {
      this.loading = true;
      operation$.subscribe({
        next: (result: Room) => {
          this.model = result;
          this.ref.triggerOk().then();
        },
        error: (error: any) => console.log(error),
        complete: () => (this.loading = false),
      });
    }
  }

  addSingleRoom(e?: any) {
    if (this.singleRoomFrm.valid) {
      this.submitRoomOperation(this.service.add(this.singleRoomFrm.getRawValue()), e);
    }
  }


  addBatchRoom(e?: any) {
    const startNumber = this.batchRoomFrm.get("startNumber")?.value;
    const endNumber = this.batchRoomFrm.get("endNumber")?.value;

    if (startNumber !== null && endNumber !== null && startNumber > endNumber) {
      this.notificationService.customErrorNotification("StartNumberCannotBeGreaterThanEndNumber!", "Unsuccess");
      return;
    }

    if (this.batchRoomFrm.valid) {
      this.submitRoomOperation(this.service.addBatchRoom(this.batchRoomFrm.getRawValue()), e);
    }
  }



  cancel() {
    this.ref.triggerCancel().then();
  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
