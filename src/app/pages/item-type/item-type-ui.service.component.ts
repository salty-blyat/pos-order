import { Injectable } from "@angular/core";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { ItemTypeOperationComponent } from "./item-type-operation.component";
import { ItemTypeDeleteComponent } from "./item-type-delete.component";

@Injectable({ providedIn: "root" })
export class ItemTypeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      ItemTypeOperationComponent,
      ItemTypeDeleteComponent,
      "640px",
      "640px",
      "640px",
      "450px"
    );
  }
}
