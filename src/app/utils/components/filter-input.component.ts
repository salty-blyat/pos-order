import {Component, EventEmitter, input, Input, model, OnInit, output, Output} from "@angular/core";

@Component({
  selector: "app-filter-input",
  template: `
    <nz-input-group [nzSuffix]="suffixIconSearch" class="input-group">
      <input
        nz-input
        [(ngModel)]="value"
        type="text"
        placeholder="{{ placeholder() ? placeholder() : ('Search' | translate) }}"
        (keyup.enter)="filterTextChanged()"
      />
    </nz-input-group>
    <ng-template #suffixIconSearch>
      <i nz-icon nzType="search"></i>
    </ng-template>
  `,
  styles: [
    `
      nz-input-group {
        width: 100%;
        padding-left: 6px;
      }

      nz-input-group {
        border-radius: var(--ant-border-radius) !important;
      }
    `,
  ],
  standalone: false,
})
export class FilterInputComponent implements OnInit {
  storageKey = model<string>("");
  value = model<string>("");
  placeholder = input<string>("");
  filterChanged = output<any>() ;

  constructor() {}

  ngOnInit(): void {
    this.changeKey();
  }

  filterTextChanged(): void {
    if (this.storageKey()) {
      sessionStorage.setItem(this.storageKey(), this.value());
    }
    this.filterChanged.emit(this.value());
  }
  changeKey() {
    if (this.storageKey()) {
      this.value.set(sessionStorage.getItem(this.storageKey()) ?? "");
      this.filterChanged.emit(this.value());
    }
  }
  public changeStorageKey(key: string) {
    this.storageKey.set(key);
    this.changeKey();
  }
}
