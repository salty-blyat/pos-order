import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { BuildingDeleteComponent } from "./building-delete.component";
import { BuildingOperationComponent } from "./building-operation.component";

@Injectable({
  providedIn: "root",
})
export class BuildingUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      BuildingOperationComponent,
      BuildingDeleteComponent,
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }
}
