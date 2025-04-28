import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import { RoomUiService } from './room-ui.service';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-room-advanced-filter',
    template: `
   <div *nzModalTitle>
      <div>
        <h4>{{ 'Advanced Filter' | translate }}</h4>
      </div>
    </div>
    <div class="modal-content">
      <form nzLayout="vertical" style="padding-top: 4px;" nz-form [formGroup]="frm">
        <nz-form-item>
          <nz-form-label>{{ 'Floor' | translate }}</nz-form-label>
          <nz-form-control>
            <app-floor-select
              [showAllOption]="true"
              formControlName="floorId"
            ></app-floor-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>{{ 'RoomStatus' | translate }}</nz-form-label>
          <nz-form-control>
            <app-room-type-select
                [showAllOption]="true"
                formControlName="roomStatusId"
            ></app-room-type-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label >{{ 'Tags' | translate }}</nz-form-label>
          <nz-form-control>
            <app-tag-multiple-select
              [showAllOption]="true"
              formControlName="tagIds"
            ></app-tag-multiple-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-row nzJustify="space-between">
        <button nz-button nzType="default" nzDanger (click)="resetForm()">
          <i nz-icon nzType="undo" nzTheme="outline"></i>
          {{ 'Reset Filter' | translate }}
        </button>
        <button nz-button nzType="default" (click)="submit()">
          <i nz-icon nzType="filter" nzTheme="outline"></i>
          {{ 'Search' | translate }}
        </button>
      </div>
    </div>
  `,
    styles: [`
      .ant-form-item-label{
        padding-bottom: 2px !important;
        > label {
          font-size: 13px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.45);
        }
      } 
  `],
  styleUrls: ['../../../assets/scss/operation.style.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class RoomAdvancedFilterComponent implements OnInit {
  constructor(
    public uiService: RoomUiService,
    private ref: NzModalRef,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder
  ) {}


  frm!: FormGroup;
  readonly modal = inject(NZ_MODAL_DATA);
  storageKey:string = this.modal?.storageKey;


  ngOnInit() {
    let advancedFilter = this.sessionStorageService.getValue(this.storageKey);
    this.initControl();
    this.setFormValue(advancedFilter);
  }
  initControl() {
    this.frm = this.fb.group({
      roomTypeId: [0],
      roomStatusId: [0],
      tagIds: [[0]],
      floorId: [0],
      houseKeepingStatusId: [0],
    });
  }

  resetForm() {
    this.initControl();
  }

  setFormValue(advanced: any) {
    this.frm.setValue({
      roomTypeId: advanced?.roomTypeId ?? 0,
      roomStatusId: advanced?.roomStatusId ?? 0,
      tagIds: advanced?.tagIds ?? [0],
      floorId: advanced?.floorId ?? 0,
      houseKeepingStatusId: advanced?.houseKeepingStatusId ?? 0,
    });
  }
  submit() {
    this.setStorageKey(this.isSetFilter());
    this.ref.triggerOk().then();
  }

  isSetFilter(): boolean {
    const defaultZeroFields = [
      'roomTypeId',
      'roomStatusId', 
      'floorId',
      'houseKeepingStatusId',
    ];
    const listTagIds = this.frm.value.tagIds.filter((id: number) => id !== 0);
    return defaultZeroFields.some((field) => this.frm.value[field] !== 0) || listTagIds.length > 0;
  }
  setStorageKey(isAdvancedFilter: boolean) {
    this.sessionStorageService.setValue({
      key: this.storageKey,
      value: { ...this.frm.getRawValue(), isAdvancedFilter: isAdvancedFilter },
    });
  }

}
