import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportGroupOperationComponent } from './report-group-operation.component';
import { ReportGroupDeleteComponent } from './report-group-delete.component';
import {BaseUiService} from "../../utils/services/base-ui.service";


@Injectable({ providedIn: 'root' })
export class ReportGroupUiService extends BaseUiService {

  override showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: ReportGroupOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzBodyStyle: { height: '210px' },
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      },
    });
  }

  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: ReportGroupOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzBodyStyle: { height: '210px' },
      nzMaskClosable: false,
      nzData: { id },
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      },
    });
  }

  override showView(id: number): void {
    this.modalService.create({
      nzContent: ReportGroupOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzBodyStyle: { height: '210px' },
      nzMaskClosable: false,
      nzData: { id, isView: true },
    });
  }

  override showDelete(id: number) {
    this.modalService.create({
      nzContent: ReportGroupDeleteComponent,
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
