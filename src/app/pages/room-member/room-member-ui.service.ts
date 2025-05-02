import {Injectable} from "@angular/core";
import {BaseUiService} from "../../utils/services/base-ui.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {RoomMemberOperationComponent} from "./room-member-operation.component";
import {RoomMemberDeleteComponent} from "./room-member-delete.component";
import {RoomInventoryMutiOperationComponent} from "../room-inventory/room-inventory-muti-operation.component";


@Injectable({
  providedIn: 'root'
})
export class RoomMemberUiService extends BaseUiService{
  constructor(
    modalService: NzModalService,
  ) {
    super(modalService, RoomMemberOperationComponent, RoomMemberDeleteComponent, '480px', '480px', '480px', '450px');
  }

  override showAdd(roomId: number, componentId: any = '') {
    this.modalService.create({
      nzContent: RoomMemberOperationComponent,
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
}