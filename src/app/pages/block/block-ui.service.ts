import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { BlockOperationComponent } from "./block-operation.component";
import { BlockDeleteComponent } from "./block-delete.component";

@Injectable({
  providedIn: "root",
})
export class BlockUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      BlockOperationComponent,
      BlockDeleteComponent,
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }
}
