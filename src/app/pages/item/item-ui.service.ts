import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { ItemOperationComponent } from "./item-operation.component";

@Injectable({ providedIn: "root" })
export class ItemUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ItemOperationComponent,
      "",
      "800px",
      "800px",
      "800px",
      "450px"
    );
  }
}
