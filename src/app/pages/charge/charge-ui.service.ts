import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";

@Injectable({
  providedIn: "root",
})
export class ChargeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      "",
      "",
      "580px",
      "580px",
      "580px",
      "450px"
    );
  }
}
