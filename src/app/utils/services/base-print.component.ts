import {Component, Inject, inject, OnInit} from "@angular/core";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {ReportService} from "../../pages/report/report.service";
import {UUID} from "uuid-generator-ts";
import {SharedDomain} from "./base-api.service";

@Component({
  template: ''
})

export class BasePrintComponent<T extends SharedDomain> implements OnInit{


  constructor(
    public modalRef: NzModalRef<any>,
    private reportService: ReportService,
    @Inject('reportName') private reportName: string,
  ) {
  }

  readonly modal:{model: T , dateRange: any, accountId: any, id: number}= inject(NZ_MODAL_DATA);
  model: T = this.modal.model;
  reportParam: any;
  publicUrl: any;
  isCopy: boolean = false;
  loading = false;
  ngOnInit(): void {
    this.search();
  }

  search() {
    if (!this.loading) {
      this.loading = true;
      this.publicUrl = "";
      setTimeout(() => {
        this.reportService.processReport({
          reportName: this.reportName,
          requestId: UUID.createUUID(),
          //For example param: {Id: {id:1, label: ''}}
          param: this.reportParam
        }).subscribe({
          next: (result: any) => {
            this.reportService.checkUrlValidity(result.url).subscribe({
              next: () => {
                this.loading = false;
                this.publicUrl = result.url;
              },
              error: (error) => {
                console.log(error);
                this.publicUrl = result.url;
                this.loading = false;
              }
            });
          },
          error: () => {
            this.loading = false;
          }
        });
      }, 200);
    }
  }

  copyText() {
    navigator.clipboard.writeText(this.publicUrl).then();
    this.isCopy = true;
    setTimeout(() => {
      this.isCopy = false;
    }, 500);
  }

  onPrint(type: any) {
    const myFrame:any = document.getElementById('myIframe');
    if (myFrame) {
      myFrame['contentWindow'].postMessage(type, '*');
    }
  }

  callIframeAction(type: any) {
    const myFrame:any = document.getElementById('myIframe');
    if (myFrame) {
      myFrame['contentWindow'].postMessage(type, '*');
    }
  }

}
