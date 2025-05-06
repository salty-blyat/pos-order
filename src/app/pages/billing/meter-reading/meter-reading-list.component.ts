import {Component, signal, ViewEncapsulation} from "@angular/core";
import {BaseListComponent} from "../../../utils/components/base-list.component";
import {MeterReading, MeterReadingService} from "./meter-reading.service";
import {MeterReadingUiService} from "./meter-reading-ui.service";
import {SessionStorageService} from "../../../utils/services/sessionStorage.service";
import {SIZE_COLUMNS} from "../../../const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Filter, QueryParam} from "../../../utils/services/base-api.service";

@Component({
  selector: 'app-meter-reading-list',
  template: `
      <nz-layout>
          <nz-row>
              <nz-col [nzSpan]="15" class="border-end padding-end">
                  <nz-content>
                      <nz-row class="row-filter">
                          <div nz-col>
                              <app-billing-cycle-select
                                      storageKey="meter-reading-list-filter-billing-cycle"
                                      (valueChanged)="billingCycleId.set($event); this.param().pageIndex = 1; search()"
                                      [showAllOption]="true"
                              ></app-billing-cycle-select>
                          </div>
                          <div nz-col>
                              <app-charge-select
                                      storageKey="meter-reading-list-filter-charge"
                                      (valueChanged)="chargeId.set($event); this.param().pageIndex = 1; search()"
                                      [showAllOption]="true"
                              ></app-charge-select>
                          </div>
                          <div nz-col>
                              <app-floor-select
                                      storageKey="meter-reading-list-filter-floor"
                                      (valueChanged)="floorId.set($event); this.param().pageIndex = 1; search()"
                                      [showAllOption]="true"
                              ></app-floor-select>
                          </div>
                      </nz-row>
                      <nz-table
                              nzSize="small"
                              nzShowSizeChanger
                              #fixedTable
                              nzTableLayout="fixed"
                              [nzPageSizeOptions]="pageSizeOption()"
                              [nzData]="lists()"
                              [nzLoading]="isLoading()"
                              [nzTotal]="param().rowCount || 0"
                              [nzPageSize]="param().pageSize || 0"
                              [nzPageIndex]="param().pageIndex || 0"
                              [nzNoResult]="noResult"
                              [nzFrontPagination]="false"
                              [nzShowPagination]="false"
                              (nzQueryParams)="onQueryParamsChange($event)"
                      >
                          <ng-template #noResult>
                              <app-no-result-found></app-no-result-found>
                          </ng-template>
                          <thead>
                          <tr>
                              <th nzEllipsis nzWidth="40px">#</th>
                              <th nzEllipsis nzWidth="120px">{{ "RoomName" | translate }}</th>
                              <th nzEllipsis>{{ "MeterSerial" | translate }}</th>
                              <th nzEllipsis nzAlign="right" nzWidth="120px">{{ "Previous" | translate }}</th>
                              <th nzEllipsis nzAlign="right" nzWidth="120px">{{ "Current" | translate }}</th>
                              <th nzEllipsis nzAlign="right" nzWidth="120px">{{ "Total" | translate }}</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr class="tr-custom" (click)="onMeterReadingClick(data)"
                              [ngClass]="{'tr-active': data.id == meterReadingId()}"
                              *ngFor="let data of lists(); let i = index">
                              <td nzEllipsis>
                                  {{ i | rowNumber : {index: param().pageIndex || 0, size: param().pageSize || 0} }}
                              </td>
                              <td nzEllipsis>
                                  {{ data.roomNumber }}
                              </td>
                              <td nzEllipsis>{{ data.meterSerial }}</td>
                              <td nzAlign="right" nzEllipsis>{{ data.previousReading }}</td>
                              <td nzAlign="right" nzEllipsis>{{ data.currentReading }}</td>
                              <td nzAlign="right" nzEllipsis>
                                  {{ data.totalUsage }}
                                  <span class="unit-name">{{ data.unitName }}</span>
                              </td>
                          </tr>
                          </tbody>
                      </nz-table>

                  </nz-content>
              </nz-col>
              <nz-col [nzSpan]="9" class="padding-start">
                  <nz-content>
                      <form nz-form [formGroup]="frm">
                          <nz-form-item>
                              <nz-form-label nzNoColon [nzSm]="7" [nzXs]="24">
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <h4 nz-typography>{{ "Reading Input" | translate }}</h4>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24"
                              >{{ "Room" | translate }}
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <app-room-select formControlName="roomId"></app-room-select>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24"
                              >{{ "MeterSerial" | translate }}
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <input nz-input formControlName="meterSerial"/>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24"
                              >{{ "Previous" | translate }}
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <nz-input-group [nzAddOnAfter]="meterReading()?.unitName">
                                      <input nz-input formControlName="previousReading"/>
                                  </nz-input-group>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24" nzRequired
                              >{{ "Current" | translate }}
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <nz-input-group [nzAddOnAfter]="meterReading()?.unitName">
                                      <input nz-input formControlName="currentReading"/>
                                  </nz-input-group>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24" nzNoColon>
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <label nz-checkbox formControlName="rollover">Rollover</label>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-label [nzSm]="7" [nzXs]="24"
                              >{{ "Total" | translate }}
                              </nz-form-label>
                              <nz-form-control [nzSm]="17" [nzXs]="24">
                                  <nz-input-group [nzAddOnAfter]="meterReading()?.unitName">
                                      <input nz-input formControlName="totalUsage"/>
                                  </nz-input-group>
                              </nz-form-control>
                          </nz-form-item>
                          <nz-form-item>
                              <nz-form-control style="text-align: right;">
                                  <button [disabled]="!frm.valid" nz-button nzType="primary">Save</button>
                              </nz-form-control>
                          </nz-form-item>
                      </form>
                  </nz-content>
              </nz-col>
          </nz-row>
      </nz-layout>
  `,
  styleUrls: ['../../../../assets/scss/list.style.scss', '../../../../assets/scss/operation-page.style.scss'],
  styles: [`
    .header-top {
      align-items: flex-start;
      line-height: unset !important;
    }
    
    .row-filter{
      gap: 6px;
      margin-bottom: 10px;
     > [nz-col]{
        min-width: 220px;
        max-width: 240px;
      }
    }
    
    .padding-start{
      padding-left: 14px;
    }
    
    .padding-end{
      padding-right: 14px;
    }
    .unit-name{
      font-size: 12px;
      font-weight: lighter;
      color: #808080;
    }
    
    .tr-active{
      background-color: rgba(var(--ant-primary-color-rgb), 0.2) !important;
    }
    
    .tr-custom:hover{
      cursor: pointer;
      td{
        background: unset !important;
      }
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})


export class MeterReadingListComponent extends BaseListComponent<MeterReading> {
  constructor(
    service: MeterReadingService,
    uiService: MeterReadingUiService,
    sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
  ) {
    super(service, uiService, sessionStorageService, "meter-reading-list");
  }
  meterReadingId = signal<number>(0);
  meterReading = signal<MeterReading | null>(null);
  billingCycleId = signal<number>(0);
  chargeId = signal<number>(0);
  floorId = signal<number>(0);

  frm!: FormGroup;

  override ngOnInit() {
    super.ngOnInit();

    this.initControl();
  }

  initControl(){
    const {required} = Validators
    this.frm = this.fb.group({
      roomId: [{value: null, disabled: true}],
      meterSerial: [{value: null, disabled: true}],
      previousReading: [{value: null, disabled: true}],
      currentReading: [null, [required]],
      rollover: [false],
      totalUsage: [{value: null, disabled: true}],
    });
  }

  onMeterReadingClick(data: MeterReading) {
    this.meterReading.set(data);
    this.meterReadingId.set(data.id!);
    this.frm.patchValue({
      roomId: data.roomId,
      meterSerial: data.meterSerial,
      previousReading: data.previousReading,
      totalUsage: data.totalUsage,
    })
  }

  override search() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      let filters:Filter[] = [{
        field: "search",
        operator: "contains",
        value: this.searchText(),
      }];
      if (this.billingCycleId()){
        filters.push({
          field: "billingCycleId",
          operator: "eq",
          value: this.billingCycleId()
        })
      }
      if (this.chargeId()){
        filters.push({
          field: "chargeId",
          operator: "eq",
          value: this.chargeId()
        })
      }
      if (this.floorId()){
        filters.push({
          field: "floorId",
          operator: "eq",
          value: this.floorId()
        })
      }
      this.param().filters = JSON.stringify(filters);
      this.service.search(this.param()).subscribe({
        next: (result: { results: MeterReading[]; param: QueryParam }) => {
          this.lists.set(result.results);
          if (!this.meterReadingId()){
            this.meterReadingId.set(result.results[0].id!);
            this.onMeterReadingClick(result.results[0]);
          }
          this.param.set(result.param);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }, 50);
  }



  protected readonly SIZE_COLUMNS = SIZE_COLUMNS;
}