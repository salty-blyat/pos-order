import { Component, signal, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Service, ServiceService } from "./service.service";
import { BaseListComponent } from "../../utils/components/base-list.component";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Filter } from "../../utils/services/base-api.service";

@Component({
  selector: "app-service",
  template: ` <div
      nz-flex
      nzGap="small"
      nzAlign="center"
      nzJustify="space-between"
      style="margin-bottom: 16px;"
    >
      <button nz-button nzType="text" (click)="router.navigate(['home'])">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;"> {{ "Back" | translate }}</span>
      </button>

      <nz-radio-group [(ngModel)]="useList">
        <label nz-radio-button [nzValue]="true">
          <i nz-icon nzType="unordered-list" nzTheme="outline"></i>
        </label>
        <label nz-radio-button [nzValue]="false">
          <i nz-icon nzType="appstore" nzTheme="outline"></i>
        </label>
      </nz-radio-group>
    </div>
    @if(isLoading()){
    <app-loading></app-loading>
    } @else if(lists().length === 0){
    <app-no-result-found></app-no-result-found>
    } @else if(!isLoading() && lists().length > 0){ @if(useList){
    <app-service-tile
      *ngFor="let data of lists()"
      [service]="data"
      (onClick)="onClick(data.id || 0)"
    >
    </app-service-tile>
    } @else {
    <div nz-row [nzGutter]="[8,8]">
      <div
        nz-col
        nzXs="12"
        nzSm="8"
        nzLg="6"
        nzXL="6" 
        *ngFor="let data of lists()"
      >
        <app-card
          (onClick)="onClick(data.id || 0)"
          [text]="data.serviceTypeName!"
          [id]="data.id! || 0"
          [image]="data.image!"
        ></app-card>
      </div>
    </div>
    } }`,
  standalone: false,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent extends BaseListComponent<Service> {
  constructor(
    service: ServiceService,
    sessionStorageService: SessionStorageService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    super(service, sessionStorageService, "service-type-list");
  }

  useList: boolean = true;

  onClick(id: number) {
    setTimeout(() => {
      this.router.navigate([`/service/${id}/operation`]);
    }, 100);
  }
  serviceId = signal<number>(0);
  protected override getCustomFilters(): Filter[] {
    const filters: Filter[] = [
      { field: "search", operator: "contains", value: this.searchText() },
    ];
    if (this.serviceId()) {
      filters.push({
        field: "serviceTypeId",
        operator: "eq",
        value: this.serviceId(),
      });
    }
    return filters;
  }
  override ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.serviceId.set(Number(params.get("id")));
    });
    this.search();
  }
}
