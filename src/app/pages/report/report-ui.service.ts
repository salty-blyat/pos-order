import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportOperationComponent } from './report-operation.component';
import { ReportDeleteComponent } from './report-delete.component';
import { MainPageService } from '../../utils/services/main-page.service';


@Injectable({ providedIn: 'root' })
export class ReportUiService {
  constructor(
    private modal: NzModalService,
    private mainPageService: MainPageService
  ) {}

  refresher = new EventEmitter<{
    key: string;
    value?: any;
    componentId?: any;
  }>();

  showAdd(reportGroupId: number, componentId: any = ''): void {
    this.modal.create({
      nzContent: ReportOperationComponent,
      nzData: { reportGroupId: reportGroupId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      },
    });
  }

  showEdit(id: number): void {
    this.modal.create({
      nzContent: ReportOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzMaskClosable: false,
      nzData: { id },
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      },
    });
  }

  showView(id: number): void {
    this.modal.create({
      nzContent: ReportOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzMaskClosable: false,
      nzData: { id, isView: true },
    });
  }

  showDelete(id: number) {
    this.modal.create({
      nzContent: ReportDeleteComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzBodyStyle: { height: '210px' },
      nzMaskClosable: false,
      nzData: { id },
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'deleted', value: e.model });
      },
    });
  }
}
