import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { AgentOperationComponent } from "./agent-operation.component";
import { AgentDeleteComponent } from "./agent-delete.component";
import { MainPageService } from "../../utils/services/main-page.service";

@Injectable({
  providedIn: "root",
})
export class AgentUiService extends BaseUiService {
  constructor(
    modalService: NzModalService,
    private mainPageService: MainPageService
  ) {
    super(
      modalService,
      AgentOperationComponent,
      AgentDeleteComponent,
      "450px",
      "450px",
      "450px",
      "450px"
    );
  }

  override showAdd(componentId: any = ""): void {
    this.modalService.create({
      nzContent: AgentOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: "710px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "added", value: e.model, componentId });
      },
    });
  }
  override showEdit(id: number): void {
    this.modalService.create({
      nzContent: AgentOperationComponent,
      nzData: { id },
      nzFooter: null,
      nzClosable: true,
      nzWidth: "710px",
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: "edited", value: e.model });
      },
    });
  }
  override showView(id: number): any {
    this.modalService.create({
      nzContent: AgentOperationComponent,
      nzData: { id, isView: true },
      nzClosable: true,
      nzFooter: null,
      nzWidth: "710px",
      nzMaskClosable: false,
    });
  }
}
