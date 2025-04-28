import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { QueryParam } from '../../utils/services/base-api.service';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { AuthService } from '../../helpers/auth.service'; 
import { RoomChargeType, RoomChargeTypeService } from './room-type-type.service';
import { RoomChargeTypeUiService } from './room-charge-type-ui.service';


@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RoomChargeTypeSelectComponent),
            multi: true,
        },
    ],
    selector: 'app-room-charge-type-select',
    template: `
      <nz-select
        nzShowSearch
        [nzDropdownRender]="actionItem"
        [nzServerSearch]="true"
        [(ngModel)]="selectedValue"
        (ngModelChange)="onModalChange()"
        (nzOnSearch)="searchText = $event; param.pageIndex = 1; search()"
        [nzDisabled]="disabled"
        style="width: 100%"
      >
        <nz-option
          *ngIf="showAllOption"
          [nzValue]="0"
          [nzLabel]="'AllRoomChargeType' | translate"
        ></nz-option>
        <nz-option
          *ngFor="let item of lists"
          nzCustomContent
          [nzValue]="item.id"
          [nzLabel]="item?.roomName + ''"
        >
          <span class="b-name">{{ item.roomName }}</span>
        </nz-option>
        <nz-option *ngIf="loading" nzDisabled nzCustomContent>
          <i nz-icon nzType="loading" class="loading-icon"></i>
          {{ 'Loading' | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption && isRoomChargeTypeAdd"
            (click)="uiService.showAdd(componentId)"
            class="item-action"
          >
            <i nz-icon nzType="plus"></i> {{ 'Add' | translate }}
          </a>
        </ng-template>
      </nz-select>
    `,
    styles: [
        `
        nz-select {
          width: 100%;
        }
        .item-action {
          flex: 0 0 auto;
          padding: 6px 8px;
          display: block;
        }
        .b-code {
          font-weight: bolder;
        }
        .b-name {
          font-size: 12px;
          padding-left: 5px;
        }
        ::ng-deep cdk-virtual-scroll-viewport {
          min-height: 34px;
        }
      `,
    ],
    standalone: false
})
export class RoomChargeTypeSelectComponent
    implements OnInit, ControlValueAccessor, OnDestroy
{
    constructor(
        private service: RoomChargeTypeService,
        private sessionStorageService: SessionStorageService,
        public uiService: RoomChargeTypeUiService,
        private authService: AuthService
    ) {}
    @Input() storageKey!: string;
    @Input() showAllOption!: boolean;
    @Input() addOption!: boolean;
    @Output() valueChanged = new EventEmitter<any>();
    parentStorageKey = 'unit-filter';
    componentId = uuidv4();
    disabled = false;
    loading = false;
    value: any = '';
    searchText = '';
    selectedValue = 0;
    refreshSub$: any;
    lists: RoomChargeType[] = [];
    param: QueryParam = {
        pageSize: 9999999,
        pageIndex: 1,
        sorts: '',
        filters: '',
    };
    isRoomChargeTypeAdd: boolean = true;

    onChangeCallback: any = () => {};
    onTouchedCallback: any = () => {};

    ngOnInit(): void {
        this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
            if (e.key === 'added' && e.componentId === this.componentId) {
                this.loading = true;
                this.selectedValue = e.value.id;
                this.service.find(this.selectedValue).subscribe((result: any) => {
                    this.loading = false;
                    this.lists.push(result);
                    this.onModalChange();
                });
            }
        });
        if (this.loading) {
            return;
        }
        if (this.showAllOption) this.selectedValue = 0;
        if (this.storageKey) {
            let recentFilters: any = [];
            recentFilters =
                this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
            const recentFilter = recentFilters.filter(
                (item: any) => item.key === this.storageKey
            )[0];
            this.selectedValue = recentFilter?.value.id ?? 0;
            if (this.selectedValue !== 0) this.lists.push(recentFilter?.value);
            this.valueChanged.emit(this.selectedValue);
            this.onChangeCallback(this.selectedValue);
            this.onTouchedCallback(this.selectedValue);
        }
    }
    search() {
        this.loading = true;
        this.param.filters = JSON.stringify([
            { field: 'Name', operator: 'contains', value: this.searchText },
        ]);
        if (this.searchText && this.param.pageIndex === 1) {
            this.lists = [];
        }
        this.service.search(this.param).subscribe((result: any) => {
            this.loading = false;
            this.lists = result.results;
        });
    }
    onModalChange() {
        this.valueChanged.emit(this.selectedValue);
        this.onChangeCallback(this.selectedValue);
        this.onTouchedCallback(this.selectedValue);
        this.setStorageKey(this.selectedValue);
    }
    writeValue(value: any) {
        this.selectedValue = value;
        this.search();
    }
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
    setStorageKey(filter: any): void {
        if (this.storageKey) {
            let value: any = [];
            let item = this.lists.filter((item) => item.id === filter)[0];
            if (filter === 0) item = { id: 0, roomName: 'all_room_charge_type' };
            value = this.sessionStorageService.getValue(this.parentStorageKey) || [];
            const index = value.findIndex((e: any) => e.key === this.storageKey);
            index !== -1
                ? (value[index].value = item)
                : value.push({ key: this.storageKey, value: item });
            this.sessionStorageService.setValue({
                key: this.parentStorageKey,
                value,
            });
        }
    }
    ngOnDestroy(): void {
        this.refreshSub$?.unsubscribe();
    }
}