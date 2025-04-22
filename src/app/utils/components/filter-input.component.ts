import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-filter-input',
    template: `
    <nz-input-group [nzSuffix]="suffixIconSearch" class="input-group">
    <input nz-input
           [(ngModel)]="value"
           type="text"
           placeholder="{{ placeholder? placeholder : ('Search' | translate)  }}"
           (keyup.enter)="filterTextChanged()"
    />
  </nz-input-group>
  <ng-template #suffixIconSearch>
    <i nz-icon nzType="search"></i>
  </ng-template>
  `,
    styles: [`
nz-input-group {
  width: 100%;
}
`],
    standalone: false
})
export class FilterInputComponent implements OnInit {
  @Input() storageKey: string="";
  @Input() value: string="";
  @Input() placeholder!: string;
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
    this.changeKey();
  }

  filterTextChanged(): void {
    if (this.storageKey){
      sessionStorage.setItem(this.storageKey, this.value);
    }
    this.filterChanged.emit(this.value);
  }
  changeKey(){
    if (this.storageKey) {
      this.value = sessionStorage.getItem(this.storageKey) ?? "";
        this.filterChanged.emit(this.value);
    }
  }
  public changeStorageKey(key: string){
    this.storageKey = key;
    this.changeKey();
  }
}
