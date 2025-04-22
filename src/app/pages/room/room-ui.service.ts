import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomDeleteComponent } from "./room-delete.component";
import { RoomAdvancedFilterComponent } from "./room-advanced-filter.component";
import { RoomOperationComponent } from "./room-operation.component";
import { RoomOperationAddComponent } from "./room-operation-add.component";

@Injectable({
  providedIn: "root",
})
export class RoomUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, RoomOperationComponent, RoomDeleteComponent, "580px", "580px", "580px", "450px");
  }

  showAdvancedFilter(componentId: any = '', storageKey: string, filterTypes?: { roomStatus?: boolean }): void {
    this.modalService.create({
      nzContent: RoomAdvancedFilterComponent,
      nzData: { filterTypes, storageKey },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '500px',
      nzBodyStyle: { minHeight: '250px' },
      nzMaskClosable: false,
      nzOnOk: (e) => {
        this.refresher.emit({
          key: 'advanced-filter-room',
          value: e.frm.getRawValue(),
          componentId: componentId

        });
      },
    });
  }

  override showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: RoomOperationAddComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '580px',
      nzBodyStyle: { paddingBottom: '10px', minHeight: '280px' },
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      }
    });
  }

}
