import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportOperationComponent } from './report-operation.component';
import { ReportDeleteComponent } from './report-delete.component';
import { MainPageService } from '../../utils/services/main-page.service';
import {BaseUiService} from "../../utils/services/base-ui.service";


@Injectable({ providedIn: 'root' })
export class ReportUiService  extends BaseUiService{
  constructor(
     modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
    super(modalService, ReportOperationComponent, ReportDeleteComponent, '580px', '500px', '500px', '450px');
  }

  override showAdd(reportGroupId: number, componentId: any = ''): void {
    this.modalService.create({
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

  override showEdit(id: number): void {
    this.modalService.create({
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

  override showView(id: number): void {
    this.modalService.create({
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
}
