import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ReportGroup, ReportGroupService } from "./report-group.service";
import { Router } from "@angular/router";
import { AuthService } from "../../helpers/auth.service";
import { QueryParam } from "../../utils/services/base-api.service";

@Component({
  selector: "app-report-group-menu",
  template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
           <div class="setting-title">
            <i nzType="container" nz-icon nzTheme="outline"></i>
            <span>{{ "Report" | translate }}</span>
          </div>
        </div>
      </nz-header>
      <nz-content class="setting-content">  
        <app-indeterminate-bar *ngIf="loading"></app-indeterminate-bar>
        <div nz-row class="content-container">
          <div 
            *ngFor="let data of list"
          >
            <div class="content-header">
              <p nz-typography>{{ data.name || "" | translate }}</p>
            </div>
            <div class="content-body" *ngFor="let subData of data.reports">
              <a [routerLink]="'/report/' + subData.id">
                <i nzType="container" nz-icon nzTheme="outline"></i>
                <span>{{ subData.label || "" | translate }}</span>
              </a>
            </div>
          </div>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styleUrls: ["../../../assets/scss/setting.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ReportGroupMenuComponent implements OnInit {
  constructor(
    private service: ReportGroupService,
    private router: Router,
    private authService: AuthService
  ) {}
  list: ReportGroup[] = [];
  loading: boolean = false;
  param: QueryParam = {
    pageSize: 9999999,
    pageIndex: 1,
    sorts: "",
    filters: "",
  };
  ngOnInit(): void {
    this.loading = true;
    this.service.search(this.param).subscribe({
      next: (result: { results: ReportGroup[]; param: QueryParam }) => {
        this.loading = false;
        this.list = result.results;
        this.list.forEach((x) => {
          x.reports = x.reports?.filter(
            (r) =>
              // console.log(r)

              !r.isHidden && this.authService.isAuthorized(r.permissionKey || 0)
          );
        });
        this.list = this.list.filter((x) => x.reports?.length! > 0);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
