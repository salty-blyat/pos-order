import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { AgentOperationComponent } from "./agent-operation.component";
import { AgentDeleteComponent } from "./agent-delete.component";

@Injectable({
  providedIn: "root",
})
export class AgentUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, AgentOperationComponent, AgentDeleteComponent, "450px", "450px", "450px", "450px");
  }
}
