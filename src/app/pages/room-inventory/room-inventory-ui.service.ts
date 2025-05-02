import {BaseUiService} from "../../utils/services/base-ui.service";
import {Injectable} from "@angular/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {RoomInventoryOperationComponent} from "./room-inventory-operation.component";
import {RoomInventoryDeleteComponent} from "./room-inventory-delete.component";
import {RoomInventoryMutiOperationComponent} from "./room-inventory-muti-operation.component";

@Injectable({
  providedIn: 'root'
})

export class RoomInventoryUiService extends BaseUiService{
  constructor(modalService: NzModalService) {
    super(modalService, RoomInventoryOperationComponent, RoomInventoryDeleteComponent, '480px', '480px', '480px', '450px');
  }

  override showAdd(roomId:number, componentId: any = "") {
    this.modalService.create({
      nzContent: RoomInventoryOperationComponent,
      nzData: {roomId},
      nzFooter: null,
      nzClosable: true,
      nzWidth: '450px',
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }

  showAddMulti(roomId: number, componentId: any = '') {
    this.modalService.create({
      nzContent: RoomInventoryMutiOperationComponent,
      nzData: {roomId},
      nzFooter: null,
      nzClosable: true,
      nzWidth: '600px',
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      }
    })
  }
}