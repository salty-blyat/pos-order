import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { RoomTypeDeleteComponent } from "./room-type-delete.component";
import { MainPageService } from "../../utils/services/main-page.service";
import { RoomTypeOperationComponent } from "./room-type-operation.component";

@Injectable({
  providedIn: "root",
})
export class RoomTypeUiService extends BaseUiService {
  constructor(
      modalService: NzModalService,
      private mainPage: MainPageService
  ) {
    super(modalService, RoomTypeOperationComponent, RoomTypeDeleteComponent, "600px", "580px", "580px", "450px");
  }


  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: RoomTypeOperationComponent,
      nzData: { id },
      nzFooter: null,
      nzClosable: true,
      nzWidth: '100%',
      nzBodyStyle: { ...this.mainPage.getModalBodyStyle() },
      nzStyle: this.mainPage.getModalFullPageSize(),
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      }
    });
  }

  override showView(id: number): any {
    this.modalService.create({
      nzContent: RoomTypeOperationComponent,
      nzData: { id, isView: true },
      nzClosable: true,
      nzFooter: null,
      nzWidth: '100%',
      nzBodyStyle: { ...this.mainPage.getModalBodyStyle() },
      nzStyle: this.mainPage.getModalFullPageSize(),
      nzMaskClosable: false,
    });
  }
}
