import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberOperationComponent } from "./member-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";
import {MemberAdvancedFilterComponent} from "./member-advanced-filter.component";
import {MemberDeleteComponent} from "./member-delete.component";

@Injectable({ providedIn: "root" })
export class MemberUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService,
  ) {
    super(
      modalService,
      MemberOperationComponent, 
      MemberDeleteComponent,
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }

  override showAdd(groupId?: number, componentId: any = ''): void {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzBodyStyle: { ...this.mainPageService.getModalBodyStyle() },
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      },
    });
  }

  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzData: { id, isEdit: true },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzBodyStyle: { ...this.mainPageService.getModalBodyStyle() },
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      },
    });
  }

  override showView(id: number): void {
    this.modalService.create({
      nzContent: MemberOperationComponent,
      nzData: { id, isView: true },
      nzClosable: true,
      nzWidth: '100%',
      nzBodyStyle: { ...this.mainPageService.getModalBodyStyle() },
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzMaskClosable: false,
    });
  }

  showAdvancedFilter(storageKey: string, componentId: any = '',  filterTypes?: { roomStatus?: boolean }): void {
    this.modalService.create({
      nzContent: MemberAdvancedFilterComponent,
      nzData: { filterTypes, storageKey },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '400px',
      nzBodyStyle: { minHeight: '100px' },
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({
          key: 'advanced-filter-member',
          value: e.frm.getRawValue(),
          componentId: componentId

        });
      },
    });
  }
}
