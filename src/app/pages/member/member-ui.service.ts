import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { MemberOperationComponent } from "./member-operation.component";
import { MainPageService } from "../../utils/services/main-page.service";

@Injectable({ providedIn: "root" })
export class MemberUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService,
  ) {
    super(
      modalService,
      MemberOperationComponent, 
      "",
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }

  override showAdd(groupId: number, componentId: any = ''): void {
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
}
