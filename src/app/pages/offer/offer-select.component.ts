import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Offer, OfferService } from "./offer.service";
import { OfferUiService } from "./offer-ui.service";
import { Filter } from "../../utils/services/base-api.service";
import { AccountTypes } from "../lookup/lookup-type.service";
import { getAccountBalance } from "../../utils/components/get-account-balance";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfferSelectComponent),
      multi: true,
    },
  ],
  selector: "app-offer-select",
  template: `
    <nz-select
      class="offer-select"
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
    >
      <nz-option
        *ngIf="showAllOption()"
        style="width:300px !important"
        [nzValue]="0"
        [nzLabel]="'AllOffer' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        nzCustomContent
        [nzValue]="item?.id"
        [nzLabel]="getRedeemLabel(item)"
      >
        <div class="b-name option-container" nz-flex nzGap="small">
          <div class="image-container">
            <img *ngIf="item.photo" [src]="item.photo" alt="" />
            <img
              *ngIf="!item.photo"
              src="./assets/image/img-not-found.jpg"
              alt=""
            />
          </div>

          <span>
            {{ item?.name }}
          </span>
          <span style="margin-left-auto">
            {{ getAccountBalance(item?.redeemWith!, item?.redeemCost) }}
          </span>
        </div>
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isOfferAdd()"
          (click)="uiService.showAdd(componentId)"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,
  standalone: false,
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
      }

      .image-container img {
        width: 100%;
        object-fit: cover;
        height: 100%;
        overflow: hidden;
      }

      .option-text {
        font-size: 14px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OfferSelectComponent
  extends BaseSelectComponent<Offer>
  implements OnChanges
{
  constructor(
    override service: OfferService,
    uiService: OfferUiService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "offer-filter",
      "all-offer"
    );
  }
  @Output() selectedObject = new EventEmitter<Offer>();
  @Input() memberId = 0;
  readonly AccountTypes = AccountTypes;
  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [];
    if (this.memberId) {
      filters.push({
        field: "memberId",
        operator: "eq",
        value: this.memberId,
      });
    }
    return filters;
  }
  getRedeemLabel(item: any): string {
    if (item.redeemWith === AccountTypes.Point) {
      return `${item.name} ${item.redeemCost} pts`;
    } else if (item.redeemWith === AccountTypes.Wallet) {
      return `${item.name} ${item.redeemCost} $`;
    } else {
      return `${item.name} ${item.redeemCost}`;
    }
  }

  override search(delay: number = 50) {
    if (this.isLoading()) return;
    if (!this.memberId) return;
    console.log(this.lists());
    this.isLoading.set(true);
    setTimeout(() => {
      this.param().filters = this.buildFilters();
      if (this.searchText() && this.param().pageIndex === 1) {
        this.lists.set([]);
      }
      this.service.getAvailable(this.param()).subscribe({
        next: (result: { results: any[] }) => {
          this.isLoading.set(false);
          this.lists.set(result.results);
          if (
            this.isDefault() &&
            this.selected() == 0 &&
            this.lists().length > 0
          ) {
            this.selected.set(this.lists()[0]?.id!);
            this.onModalChange();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, delay);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selected.set(0);
    this.search();
  }

  override onModalChange() {
    this.valueChanged.emit(this.selected());
    this.onChangeCallback(this.selected());
    this.onTouchedCallback(this.selected());
    this.setStorageKey(this.selected());

    const selectedOffer = this.lists().find((o) => o.id === this.selected());

    this.selectedObject.emit(selectedOffer);
  }

  getAccountBalance = getAccountBalance;
  isOfferAdd = signal<boolean>(true);
}
