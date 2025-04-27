import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { ItemOperationComponent } from "./item-operation.component";
import { ItemDeleteComponent } from "./item-delete.component";

@Injectable({ providedIn: "root" })
export class ItemUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ItemOperationComponent,
      ItemDeleteComponent,
      "640px",
      "640px",
      "640px",
      "450px"
    );
  }
}
