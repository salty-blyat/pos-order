import { Component, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { ProcessReportModel, Report, ReportService } from "./report.service";
import { ActivatedRoute, Data } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { UUID } from "uuid-generator-ts";
@Component({
  selector: "app-report-view",
  template: `
    <nz-layout>
      <app-breadcrumb
        *ngIf="breadcrumbData()"
        [data]="breadcrumbData()"
      ></app-breadcrumb>
      <nz-header style="align-items: center">
        <div nz-row>
          <app-report-filter
            [formItems]="model.params || []"
            *ngIf="(model.params || []).length > 0"
            (onSubmit)="
              generateReportModel.param = $event;
              setStorageKey($event);
              search()
            "
          ></app-report-filter>
        </div>
        <div nz-row>
          <!-- <button
                      nz-button
                      nzType="primary"
                      style="margin-right: 4px"
                      (click)="toFile('print')"
                    >
                      <i nz-icon nzType="printer" nzTheme="outline"></i>
                      {{ 'Print' | translate }}
                    </button> -->
          <button nz-button style="margin-right: 4px" (click)="toFile('xls')">
            <i
              nz-icon
              nzType="file-excel"
              nzTheme="outline"
              style="color: #1D6F42"
            ></i>
            Excel
          </button>
          <button nz-button (click)="toFile('word')">
            <i
              nz-icon
              nzType="file-word"
              nzTheme="outline"
              style="color: #2d4fa3"
            ></i>
            Word
          </button>
        </div>
      </nz-header>
      <nz-content
        class="content-report"
        [ngStyle]="{ backgroundColor: '#f0f2f5' }"
      >
        <app-indeterminate-bar *ngIf="isLoading"></app-indeterminate-bar>
        <iframe
          *ngIf="publicUrl()"
          [src]="publicUrl() | safe"
          style="width: 100%;height:100%;border:none"
          name="myIframe"
        ></iframe>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .content-report {
        height: calc(100vh - 120px);
      }
      [nz-form] {
        .ant-form-item {
          margin-bottom: 0 !important;
        }
      }
    `,
  ],
  styleUrls: ["../../../assets/scss/list.style.scss"],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class ReportViewComponent implements OnInit {
  constructor(
    private service: ReportService,
    private activated: ActivatedRoute,
    private sessionStorageService: SessionStorageService
  ) {}
  isLoading = signal(false);
  generateReportModel: ProcessReportModel = {
    reportName: "",
    requestId: UUID.createUUID(),
    param: {},
  };
  id: number = +(this.activated.snapshot.paramMap.get("id") || 0);
  breadcrumbData = signal<any>(null);
  publicUrl = signal<string>("");
  model: Report = {};
  ngOnInit(): void {
    this.isLoading.set(true);
    this.service.find(this.id).subscribe({
      next: (result: Report) => {
        this.model = result;
        this.generateReportModel.reportName = this.model.name;
        this.breadcrumbData.set(
          new Observable<Data>((observer) => {
            observer.next([
              { index: 0, label: "Report", url: "/report" },
              { index: 1, label: this.model.label, url: null },
            ]);
          })
        );
        this.isLoading.set(false);
        this.seedParamsFromSessionStorage();
        this.search();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  search() {
    if (!this.isLoading()) {
      this.isLoading.set(true);
      this.publicUrl.set("");
      setTimeout(() => {
        this.service.processReport(this.generateReportModel).subscribe({
          next: (result: any) => {
            this.service.checkUrlValidity(result?.url).subscribe({
              next: () => {
                this.isLoading.set(false);
                this.publicUrl.set(result?.url);
              },
              error: () => {
                this.publicUrl.set(result?.url);
                this.isLoading.set(false);
              },
            });
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      }, 100);
    }
  }

  onDateRangeChange($event: any) {
    this.generateReportModel.param["startDate"] = $event[0];
    this.generateReportModel.param["endDate"] = $event[1];
  }

  triggerDownload(): void {
    // const a = document.createElement('a');
    // const url = this.service.getPublicUrl({...this.generateReportModel, renderType: renderType});
    // a.href = url;
    // a.download = <string>url.split('/').pop()
    // document.body.appendChild(a)
    // a.click()
    // document.body.removeChild(a)
  }

  toFile(type: any) {
    window.open(`${this.publicUrl()}?format=${type}`, "_blank");

    // const myFrame = document.getElementsByName('myIframe')[0];
    // // @ts-ignore
    // myFrame['contentWindow'].postMessage(type, '*');
  }

  setStorageKey(filter: any) {
    if (this.generateReportModel.reportName) {
      let sessionParams: any[] = [];
      sessionParams =
        this.sessionStorageService.getValue("dynamic-report") || [];
      const index = sessionParams.findIndex(
        (e) => e.key === this.generateReportModel.reportName
      );
      index !== -1
        ? (sessionParams[index].value = filter)
        : sessionParams.push({
            key: this.generateReportModel.reportName,
            value: filter,
          });
      this.sessionStorageService.setValue({
        key: "dynamic-report",
        value: sessionParams,
      });
    }
  }
  seedParamsFromSessionStorage() {
    let sessionParams =
      (this.sessionStorageService.getValue("dynamic-report") as Array<any>) ??
      [];
    let filters = sessionParams.filter(
      (e) => e.key === this.generateReportModel.reportName
    )[0]?.value;
    if (filters) {
      this.model.params?.forEach(
        (item: any) =>
          (item["defaultValue"] = filters[item.key] ?? item["defaultValue"])
      );
    }
  }
}
