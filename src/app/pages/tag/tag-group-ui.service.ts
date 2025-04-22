import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TagGroupOperationComponent } from './tag-group-operation.component';
import { TagGroupDeleteComponent } from './tag-group-delete.component';
import { BaseUiService } from '../../utils/services/base-ui.service';

@Injectable({
  providedIn: 'root'
})
export class TagGroupUiService extends BaseUiService {
  constructor(modalService: NzModalService) { 
    super(modalService, TagGroupOperationComponent, TagGroupDeleteComponent, "650px", "650px", "650px", "450px");
  }

  override showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: TagGroupOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '600px',
      nzBodyStyle: { paddingBottom: '10px', height: '300px'},
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      }
    });
  }

  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: TagGroupOperationComponent,
      nzData: { id ,isEdit: true },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '600px',
      nzBodyStyle: { paddingBottom: '10px', height: '300px'},
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      }
    });
  }
  override showView(id: number): void {
    this.modalService.create({
      nzContent: TagGroupOperationComponent,
      nzData: { id ,isView: true },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '600px',
      nzBodyStyle: { paddingBottom: '10px', height: '300px'},
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'viewed', value: e.model });
      }
    });
  }
}
