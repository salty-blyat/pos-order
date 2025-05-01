import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomDeleteComponent } from "./room-delete.component";
import { RoomAdvancedFilterComponent } from "./room-advanced-filter.component";
import { RoomOperationComponent } from "./room-operation.component";
import {MainPageService} from "../../utils/services/main-page.service";
import {RoomViewComponent} from "./room-view.component";

@Injectable({
  providedIn: "root",
})
export class RoomUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
    super(modalService, RoomOperationComponent, RoomDeleteComponent, "560px", "560px", "560px", "450px");
  }

  override showView(id: number): any {
    this.modalService.create({
      nzContent: RoomViewComponent,
      nzData: { id, isView: true },
      nzClosable: true,
      nzFooter: null,
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: this.mainPageService.getModalFullPageSize(),
      nzWidth: '100%',
      nzMaskClosable: false,
    });
  }

  showAdvancedFilter(storageKey: string, componentId: any = ''): void {
    this.modalService.create({
      nzContent: RoomAdvancedFilterComponent,
      nzData: { storageKey },
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
