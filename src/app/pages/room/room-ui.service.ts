import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomDeleteComponent } from "./room-delete.component";
import { RoomAdvancedFilterComponent } from "./room-advanced-filter.component";
import { RoomOperationComponent } from "./room-operation.component";

@Injectable({
  providedIn: "root",
})
export class RoomUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, RoomOperationComponent, RoomDeleteComponent, "560px", "560px", "560px", "450px");
  }

  showAdvancedFilter(storageKey: string, componentId: any = '',  filterTypes?: { roomStatus?: boolean }): void {
    this.modalService.create({
      nzContent: RoomAdvancedFilterComponent,
      nzData: { filterTypes, storageKey },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '400px',
      nzBodyStyle: { minHeight: '100px' },
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

}
