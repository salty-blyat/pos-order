import {
  Component,
  forwardRef,
  inject,
  input,
  OnDestroy, OnInit,
  output,
  signal
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
import { RoomUiService } from './room-ui.service';
import { v4 as uuidv4 } from 'uuid';
import { QueryParam } from '../../utils/services/base-api.service';
import {Room, RoomService} from "./room.service";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoomSelectComponent),
      multi: true,
    },
  ],
  selector: 'app-room-select',
  template: `
    <nz-select
        nzShowSearch
        [nzDropdownRender]="actionItem"
        [nzServerSearch]="true"
        [(ngModel)]="selected"
        (ngModelChange)="onModalChange()"
        (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
        [nzDisabled]="disabled()"
        style="width: 100%"
      >
        <nz-option
          *ngIf="showAllOption"
          [nzValue]="0"
          [nzLabel]="'AllRoom' | translate"
        ></nz-option>
        <nz-option
          *ngFor="let item of lists()"
          nzCustomContent
          [nzValue]="item.id"
          [nzLabel]="item?.roomNumber + ''"
        >
          <span class="b-name">{{ item.roomNumber }}</span>
        </nz-option>
        <nz-option *ngIf="loading()" nzDisabled nzCustomContent>
          <i nz-icon nzType="loading" class="loading-icon"></i>
          {{ 'Loading' | translate }}
        </nz-option>
        <ng-template #actionItem>
          <a
            *ngIf="addOption() && isBlockAdd"
            (click)="roomUiService.showAdd(componentId)"
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
export class RoomSelectComponent implements OnInit,  ControlValueAccessor, OnDestroy {
  constructor() {}
  readonly roomService = inject(RoomService);
  readonly sessionStorageService = inject(SessionStorageService);
  readonly roomUiService = inject(RoomUiService);

  readonly storageKey = input<string>('');
  readonly addOption = input<boolean>(true);
  readonly showAllOption = input<boolean>(true);
  readonly valueChanged = output<any>();
  parentStorageKey = 'room-filter';
  componentId = uuidv4();
  disabled = signal<boolean>(false);
  loading = signal<boolean>(false);
  searchText  = signal<string>('');
  selected = signal<number>(0);
  refreshSub$: any;
  readonly lists = signal<Room[]>([]);
  readonly param = signal<QueryParam>({
    pageSize: 9999999,
    pageIndex: 1,
    sorts: '',
    filters: '',
  });
  isBlockAdd: boolean = true;

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};


  ngOnInit(): void {
      this.refreshSub$ = this.roomUiService.refresher.subscribe((e) => {
        if (e.key === 'added' && e.componentId === this.componentId) {
          this.loading.set(true);
          this.selected.set(e.value.id);
          this.roomService.find(this.selected()).subscribe((result: any) => {
            this.loading.set(false);
            this.lists.update((value) => [...value, result,]);
            this.onModalChange();
          });
        }
      });
      if (this.loading()) {
      return;
    }
    if (this.showAllOption()) this.selected.set(0);
    if (this.storageKey()) {
      let recentFilters: any = [];
      recentFilters =
        this.sessionStorageService.getValue(this.parentStorageKey) ?? [];
      const recentFilter = recentFilters.filter(
        (item: any) => item.key === this.storageKey()
      )[0];
      this.selected.set(recentFilter?.value.id ?? 0);
      if (this.selected() !== 0) this.lists.update(value => [...value, recentFilter?.value]);
      this.valueChanged.emit(this.selected());
      this.onChangeCallback(this.selected());
      this.onTouchedCallback(this.selected());
    }

  }

  search() {
      this.loading.set(true);
      this.param.update(
        (value) =>{
          value.filters = JSON.stringify([
            { field: 'RoomNumber', operator: 'contains', value: this.searchText() },
          ]);
          return value})
      if (this.searchText() && this.param().pageIndex === 1) {
          this.lists.set([]);
      }
      this.roomService.search(this.param()).subscribe((result: any) => {
          this.loading.set(false);
          this.lists.set(result.results);
      });
  }
  onModalChange() {
      this.valueChanged.emit(this.selected());
      this.onChangeCallback(this.selected());
      this.onTouchedCallback(this.selected());
      this.setStorageKey(this.selected());
  }
  writeValue(value: any) {
      this.selected.set(value);
      this.search();
  }
  registerOnChange(fn: any) {
      this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
      this.disabled.set(isDisabled);
  }
  setStorageKey(filter: any): void {
      if (this.storageKey()) {
          let value: any;
          let item = this.lists().filter((item) => item.id === filter)[0];
          if (filter === 0) item = { id: 0, roomNumber: 'all_room' };
          value = this.sessionStorageService.getValue(this.parentStorageKey) || [];
          const index = value.findIndex((e: any) => e.key === this.storageKey());
          index !== -1
              ? (value[index].value = item)
              : value.push({ key: this.storageKey(), value: item });
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

