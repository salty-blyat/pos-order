import { Component, computed, Input, OnInit, Renderer2 } from '@angular/core';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { ProcessReportModel, Report, ReportService } from './report.service';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../../utils/services/sessionStorage.service';
@Component({
    selector: 'app-report-view',
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
      <nz-content [ngStyle]="{ backgroundColor: '#f0f2f5' }">
        <app-indeterminate-bar *ngIf="loading"></app-indeterminate-bar>
        <iframe
          *ngIf="publicUrl"
          [src]="publicUrl | safe"
          style="width: 100%;height:100%;border:none"
          name="myIframe"
        ></iframe>
      </nz-content>
    </nz-layout>
  `,
    styles: [``],
    styleUrls: ["../../../assets/scss/list.style.scss"],
    standalone: false
})
export class ReportViewComponent implements OnInit {
  constructor(
    private service: ReportService,
    private renderer: Renderer2,
    private activated: ActivatedRoute,
    private sessionStorageService: SessionStorageService
  ) {}
  loading: boolean = false;
  generateReportModel: ProcessReportModel = {
    reportName: '',
    requestId: uuidv4(),
    param: {},
  };
  id: number = +(this.activated.snapshot.paramMap.get('id') || 0);
  breadcrumbData = computed<Observable<Data>>(() => this.activated.data);
  publicUrl!: string;
  model: Report = {};
  ngOnInit(): void {
    this.loading = true;
    this.service.find(this.id).subscribe(
      (result: Report) => {
        this.model = result;
        this.generateReportModel.reportName = this.model.name;
        
        this.loading = false;
        this.seedParamsFromSessionStorage();
        this.search();
      },
      () => {
        this.loading = false;
      }
    );
  }

  search() {
    if (!this.loading) {
      this.loading = true;
      this.publicUrl = '';
      setTimeout(() => {
        this.service.processReport(this.generateReportModel).subscribe(
          (result) => {
            this.service.checkUrlValidity(result.url).subscribe(
              (response) => {
                this.loading = false;
                this.publicUrl = result.url;
              },
              (err) => {
                this.publicUrl = result.url;
                this.loading = false;
              }
            );
          },
          () => {
            this.loading = false;
          }
        );
      }, 100);
    }
  }

  onDateRangeChange($event: any) {
    this.generateReportModel.param['startDate'] = $event[0];
    this.generateReportModel.param['endDate'] = $event[1];
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
    window.open(`${this.publicUrl}?format=${type}`, '_blank');

    // const myFrame = document.getElementsByName('myIframe')[0];
    // // @ts-ignore
    // myFrame['contentWindow'].postMessage(type, '*');
  }

  setStorageKey(filter: any) {
    if (this.generateReportModel.reportName) {
      let sessionParams: any[] = [];
      sessionParams =
        this.sessionStorageService.getValue('dynamic-report') || [];
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
        key: 'dynamic-report',
        value: sessionParams,
      });
    }
  }
  seedParamsFromSessionStorage() {
    let sessionParams =
      (this.sessionStorageService.getValue('dynamic-report') as Array<any>) ??
      [];
    let filters = sessionParams.filter(
      (e) => e.key === this.generateReportModel.reportName
    )[0]?.value;
    if (filters) {
      this.model.params?.forEach(
        (item: any) =>
          (item['defaultValue'] = filters[item.key] ?? item['defaultValue'])
      );
    }
  }
}
