import { Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import {
  ProcessReportModel,
  Report,
  ReportService,
} from "../report/report.service";
import { Orientation } from "../../const";
import { PageSize } from "../../const";
import { DatetimeHelper } from "../../helpers/datetime-helper";

@Component({
  selector: "app-redemption-print",
  template: `
    <div class="page-content" style="padding: 0; height: 100%">
      <div *nzModalTitle class="modal-header-ellipsis">
        <span *ngIf="!modal?.model?.id"> {{ "loading" | translate }}</span>
        <span *ngIf="modal?.model?.id"> {{ modal?.model?.redeemNo }} </span>
      </div>
      <nz-content
        [ngStyle]="{ backgroundColor: '#f0f2f5' }"
        style="height: 100%"
      >
        <app-indeterminate-bar
          *ngIf="loading || loadingReport"
        ></app-indeterminate-bar>
        <iframe
          *ngIf="publicUrl"
          [src]="publicUrl | safe"
          style="width: 100%;height:100%;border:none"
          id="myIframe"
        ></iframe>
      </nz-content>
      <div *nzModalFooter>
        <!-- <a nz-typography (click)="toFile('word')">
          <i nz-icon nzTheme="outline" nzType="file-word"></i>
          <span class="action-text"> {{ 'Word' | translate }}</span>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a nz-typography (click)="toFile('excel')">
          <i nz-icon nzTheme="outline" nzType="file-excel"></i>
          <span class="action-text"> {{ 'Excel' | translate }}</span>
        </a>
        <nz-divider nzType="vertical"></nz-divider> -->
        <a href="{{ this.publicUrl }}" target="_blank">
          <i nz-icon nzTheme="outline" nzType="cloud-upload"></i>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a (click)="copyText()" [ngStyle]="{ color: isCopy ? '#52c41a' : '' }">
          <i nz-icon [nzType]="isCopy ? 'check' : 'copy'" nzTheme="outline"></i>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a
          nz-button
          style="border: none; background: none; box-shadow: none; padding: 0"
          (click)="modalRef.triggerCancel()"
        >
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  standalone: false,
  styles: [
    `
      ::ng-deep .ant-modal.modal-fullsize {
        top: 16px !important;
      }
      ::ng-deep .ant-modal.modal-fullsize > .ant-modal-content {
        height: 95.9vh !important;
      }
      ::ng-deep .ant-modal-wrap {
        overflow: hidden;
      }
    `,
  ],
})
export class RedemptionPrintComponent implements OnInit, OnDestroy {
  constructor(
    public modalRef: NzModalRef,
    private reportService: ReportService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  report: Report = {};
  publicUrl: any;
  loading!: boolean;
  loadingReport!: boolean;
  isCopy: boolean = false;
  uuid = uuidv4();
  refreshSub$: any;
  readonly PAGE_SIZE = PageSize;
  readonly ORIENTATION = Orientation;
  async ngOnInit() {
    if (this.modal?.reportId) {
      try {
        this.loadingReport = true;
        this.report = await this.reportService
          .find(this.modal?.reportId)
          .toPromise(); 
        this.loadingReport = false;
        console.log(this.modal?.model); 
      } catch {
        this.loadingReport = false;
        return;
      }
    }

    // this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
    //   if (e.key === 'deleted') {
    //     this.modalRef.triggerCancel();
    //   } else {
    //     this.search();
    //   }
    // });
    this.search();
  }

  search() {
    if (!this.loading) {
      this.loading = true;
      this.publicUrl = "";
      setTimeout(() => {
        let param = {};
        this.report.params?.forEach((x) => {
          if (x.key == "DateRange") {
            // @ts-ignore
            param[x.key] = {
              id: `${new Date().toISOString()},${new Date().toISOString()}`,
              label: `${DatetimeHelper.toShortDateString(
                new Date()
              )} ~ ${DatetimeHelper.toShortDateString(new Date())}`,
            };
          } else if (x.key == "Id") {
            // @ts-ignore
            param[x.key] = {
              id: this.modal?.model?.id,
              label: "",
            };
          } else {
            // @ts-ignore
            param[x.key] = {
              id: 0,
              label: "",
            };
          }
        });

        this.reportService
          .processReport({
            reportName: this.report.name,
            requestId: uuidv4(),
            param: { Id: { id: 404, value: "" } },
          })
          .subscribe(
            (result) => {
              this.reportService.checkUrlValidity(result).subscribe(
                (response) => {
                  this.loading = false;
                  this.publicUrl = result.url;
                },
                () => {
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

  copyText() {
    navigator.clipboard.writeText(this.publicUrl);
    this.isCopy = true;
    setTimeout(() => {
      this.isCopy = false;
    }, 500);
  }

  onPrint() {
    const myFrame = document.getElementById("myIframe");
    if (myFrame) {
      // @ts-ignore
      myFrame["contentWindow"].postMessage("print", "*");
    }
  }
  toFile(type: any) {
    const myFrame = document.getElementsByName("myIframe")[0];
    // @ts-ignore
    // myFrame['contentWindow'].postMessage(type, '*');
    window.open(`${this.publicUrl}?format=${type}`, "_blank");
  }
  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
