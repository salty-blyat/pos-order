import { Component } from "@angular/core";
import { BaseOperationComponent } from "../../utils/components/base-operation.component";
import { RoomType, RoomTypeService } from "./room-type.service";
import { FormBuilder } from "@angular/forms";
import { CommonValidators } from "../../utils/services/common-validators";
import { NzModalRef } from "ng-zorro-antd/modal";
import { RoomTypeUiService } from "./room-type-ui.service";
import { LOOKUP_TYPE } from "../lookup/lookup-type.service";

@Component({
  selector: "app-room-type-operation",
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
      <span *ngIf="modal?.id && !modal?.isView">
        {{ "Edit" | translate }} {{ model?.name || ("Loading" | translate) }}
      </span>
      <span *ngIf="modal?.id && modal?.isView">{{ model?.name || ("Loading" | translate) }}</span>
    </div>

    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <form nz-form [formGroup]="frm"  [nzAutoTips]="autoTips" class="form-content">
        
        <div nz-row>
          <!-- Room Type Information -->
          <div nz-col nzSpan="10">
            <h3 class="label">{{ "RoomTypeInformation" | translate }}</h3>
            <nz-form-item>
              <nz-form-label nzSpan="6" nzRequired>{{ "Name" | translate }}</nz-form-label>
              <nz-form-control nzSpan="18" nzHasFeedback>
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="6" nzRequired>{{ "RoomClass" | translate }}</nz-form-label>
              <nz-form-control nzSpan="18">
                <app-lookup-item-select formControlName="roomClass" [lookupType]="LOOKUP_TYPE.RoomClass" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="6">{{ "RoomSize" | translate }}</nz-form-label>
              <nz-form-control nzSpan="18" nzErrorTip="">
                <input nz-input formControlName="size" />
              </nz-form-control>
            </nz-form-item>
            
            <nz-form-item>
              <nz-form-label nzSpan="6">{{ "Description" | translate }}</nz-form-label>
              <nz-form-control nzSpan="18">
                <textarea nz-input type="text" formControlName="description" rows="3"></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
          <!-- Default -->
          <div nz-col nzSpan="5" nzOffset="2">
            <h3 class="label">{{ "Occupancy" | translate }}</h3>
            <nz-form-item>
              <nz-form-label nzSpan="10" nzRequired>{{ "BaseAdult" | translate }}</nz-form-label>
              <nz-form-control nzSpan="14" nzErrorTip="">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="baseAdults" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="10" nzRequired>{{ "BaseChild" | translate }}</nz-form-label>
              <nz-form-control nzSpan="14" nzErrorTip="">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="baseChildren" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="10" nzRequired>{{ "MaxAdults" | translate }}</nz-form-label>
              <nz-form-control nzSpan="14" nzErrorTip="">
                <nz-input-number c formControlName="maxAdults" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="10" nzRequired>{{ "MaxChildren" | translate }}</nz-form-label>
              <nz-form-control nzSpan="14" nzErrorTip="">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="maxChildren" />
              </nz-form-control>
            </nz-form-item>
            
            <!-- <nz-form-item>
              <nz-form-label  nzRequired>{{ "MaxOccupancy" | translate }}</nz-form-label>
              <nz-form-control  nzErrorTip="">
                <nz-input-number [nzMin]="0" [nzStep]="1" [nzPrecision]="0" formControlName="maxOccupancy" />
              </nz-form-control>
            </nz-form-item> -->
          </div>
          <div nz-col nzSpan="6" nzOffset="1">
            <h3 class="label">{{ "DefaultPrice" | translate }}</h3>
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>{{ "BasePrice" | translate }}</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="">
                <nz-input-number [nzPrecision]="2" [nzMin]="0" formControlName="basePrice" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>{{ "AdultPrice" | translate }}</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="">
                <nz-input-number [nzPrecision]="2" [nzMin]="0" formControlName="basePriceAdult" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>{{ "ChildPrice" | translate }}</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="">
                <nz-input-number [nzPrecision]="2" [nzMin]="0" formControlName="basePriceChild" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
      </form>
    </div>
    <div *nzModalFooter>
      <div *ngIf="!modal?.isView">
        <button nz-button nzType="primary" [disabled]="!frm.valid" (click)="onSubmit($event)">
          <i *ngIf="loading" nz-icon nzType="loading"></i>
          {{ "Save" | translate }}
        </button>
        <button nz-button nzType="default" (click)="cancel()">
          {{ "Cancel" | translate }}
        </button>
      </div>
      <div *ngIf="modal?.isView">
        <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!loading && isRoomTypeEdit">
          <i nz-icon nzType="edit" nzTheme="outline"></i>
          <span class="action-text"> {{ "Edit" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isRoomTypeEdit"></nz-divider>
        <a
          nz-typography
          nzType="danger"
          (click)="uiService.showDelete(model.id || 0)"
          *ngIf="!loading && isRoomTypeRemove"
        >
          <i nz-icon nzType="delete" nzTheme="outline"></i>
          <span class="action-text"> {{ "Delete" | translate }}</span>
        </a>
        <nz-divider nzType="vertical" *ngIf="!loading && isRoomTypeRemove"></nz-divider>
        <a nz-typography (click)="cancel()" style="color: gray;">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/operation_page.scss"],
  styles: `
    .modal-content {
      padding: 10px 50px;
      height: 100%;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      row-gap: 0;
      column-gap: 32px;
    }
    .form-content {
      height: 100%;  
      display: flex;
      flex-direction: column;
      
    }
    .amenity-container {
      min-height: 350px;
      overflow-y: auto; 
    }
    .amenity-group {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      row-gap: 10px;
      column-gap: 32px;
    }
    .amenity-title {
      margin-bottom: 10px;
    }
    .amenity-title label {
      font-size: 16px;
      font-weight: 600;
    }
    .label {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  `,
  standalone: false
})

export class RoomTypeOperationComponent extends BaseOperationComponent<RoomType> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<RoomTypeOperationComponent>,
    service: RoomTypeService,
    uiService: RoomTypeUiService
  ) {
    super(fb, ref, service, uiService);
  }

  isRoomTypeEdit: boolean = true;
  isRoomTypeRemove: boolean = true;


  override ngOnInit(): void {
    if (this.loading) return;
    this.initControl();
  }

  override initControl(): void {
    const { nameExistValidator, required, nameMaxLengthValidator } = CommonValidators;
    this.frm = this.fb.group({
      name: [null,
        [required, nameMaxLengthValidator],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      roomClass: [null, [required]],
      maxOccupancy: [0, [required]],
      baseAdults: [0, [required]],
      baseChildren: [0, [required]],
      maxAdults: [0, [required]],
      maxChildren: [0, [required]],
      basePrice: [0, [required]],
      basePriceAdult: [0, [required]],
      basePriceChild: [0, [required]],
      size: [null],
      description: [null],
      amenityGroup: this.fb.array([]),
    });
  }

  override setFormValue() {
    if (!this.model) {
      return;
    }
    this.frm.patchValue({
      id: this.model.id,
      name: this.model.name,
      maxOccupancy: this.model.maxOccupancy ?? 0,
    });


  }

  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
