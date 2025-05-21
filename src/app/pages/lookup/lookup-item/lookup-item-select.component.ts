import {
  Component,
  computed,
  forwardRef,
  input,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { LookupItem, LookupItemService } from "./lookup-item.service";
import { LookupItemUiService } from "./lookup-item-ui.service";
import { LOOKUP_TYPE } from "../lookup-type.service";
import { SessionStorageService } from "../../../utils/services/sessionStorage.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../../helpers/auth.service";
import { BaseSelectComponent } from "../../../utils/components/base-select.component";
import { AuthKeys } from "../../../const";
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LookupItemSelectComponent),
      multi: true,
    },
  ],
  selector: "app-lookup-item-select",
  template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [nzAllowClear]="allowClear()"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
      [nzCustomTemplate]="customTemplate"
    >
      <nz-option
        *ngIf="showAllOption()"
        [nzValue]="0"
        [nzLabel]="typeLabelAll() ? typeLabelAll() : (showAll() | translate)"
      ></nz-option>
      <ng-container *ngIf="lookupType() !== LOOKUP_TYPE.AccountType">
        <nz-option
          *ngFor="let item of lists()"
          [nzValue]="item.valueId"
          nzCustomContent
          [nzLabel]="
            (this.translate.currentLang === 'km'
              ? item.name || item.nameEn
              : item.nameEn || item.name) || ''
          "
        >
          <div class="option-container">
            <!-- <div class="image-container" *ngIf="item.image">
              <img *ngIf="item.image" [src]="item.image.url" alt="" />
            </div> -->
            <span
              [ngStyle]="{ color: item.color ?? '#000000D9' }"
              class="option-text"
            >
              {{
                (this.translate.currentLang === "km"
                  ? item.name || item.nameEn
                  : item.nameEn || item.name) || ""
              }}
            </span>
          </div>
        </nz-option>
      </ng-container>
      <ng-container *ngIf="lookupType() == LOOKUP_TYPE.AccountType">
        <nz-option
          *ngFor="let item of lists(); let i = index"
          nzCustomContent
          [nzValue]="item.valueId"
          [nzLabel]="
            (this.translate.currentLang === 'km'
              ? item.name || item.nameEn
              : item.nameEn || item.name) || ''
          "
        >
          <div class="option-container">
            <!-- <div class="image-container">
              <img *ngIf="item.image" [src]="item.image.url" alt="" />
              <img
                *ngIf="!item.image"
                src="./assets/image/img-not-found.jpg"
                alt=""
              />
            </div> -->
            <span
              [ngStyle]="{ color: item.color ?? '#000000D9' }"
              class="option-text"
            >
              {{
                (this.translate.currentLang === "km"
                  ? item.name || item.nameEn
                  : item.nameEn || item.name) || ""
              }}
            </span>
          </div>
        </nz-option>
      </ng-container>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #customTemplate let-selected>
        {{ selected.nzLabel }}
      </ng-template>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isLookupAdd()"
          (click)="uiService.showAdd(lookupType())"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
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

      .option-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .image-container {
        height: 22px;
        width: 22px;
        border-radius: 50%;
      }

      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
      }

      .option-text {
        font-size: 14px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class LookupItemSelectComponent extends BaseSelectComponent<LookupItem> {
  constructor(
    service: LookupItemService,
    uiService: LookupItemUiService,
    sessionStorageService: SessionStorageService,
    public translate: TranslateService,
    private authService: AuthService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "lookup-item-filter",
      "all-lookup-item"
    );
  }

  showAll = input<string>("All");
  allowClear = input<boolean>(false);
  lookupType = input<LOOKUP_TYPE>(LOOKUP_TYPE.AccountType);
  statuses = input<number[]>([]);
  typeLabelAll = input<string>("");
  isLookupAdd = signal(false);

  override search() {
    this.isLoading.set(true);
    setTimeout(() => {
      setTimeout(() => {
        this.param().filters = JSON.stringify([
          { field: "Name", operator: "contains", value: this.searchText() },
          { field: "lookupTypeId", operator: "eq", value: this.lookupType() },
        ]);
        if (this.searchText() && this.param().pageIndex === 1) {
          this.lists.set([]);
        }
        this.service.search(this.param()).subscribe({
          next: (result: { results: LookupItem[] }) => {
            this.isLoading.set(false);
            if (this.statuses.length > 0) {
              this.lists.set(
                result.results.filter(
                  (x: LookupItem) => !this.statuses().includes(x?.valueId!)
                )
              );
            } else {
              this.lists.set(result.results);
            }
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      });
    }, 50);
  }
  isLookupItemAdd = computed(() => true);
  protected readonly LOOKUP_TYPE = LOOKUP_TYPE;
}
