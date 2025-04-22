import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportGroupOperationComponent } from './report-group-operation.component';
import { ReportGroupDeleteComponent } from './report-group-delete.component';


@Injectable({ providedIn: 'root' })
export class ReportGroupUiService {
  constructor(private modal: NzModalService) {}

  refresher = new EventEmitter<{
    key: string;
    value?: any;
    componentId?: any;
  }>();

  showAdd(componentId: any = ''): void {
    this.modal.create({
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

  showEdit(id: number): void {
    this.modal.create({
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

  showView(id: number): void {
    this.modal.create({
      nzContent: ReportGroupOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzBodyStyle: { height: '210px' },
      nzMaskClosable: false,
      nzData: { id, isView: true },
    });
  }

  showDelete(id: number) {
    this.modal.create({
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
