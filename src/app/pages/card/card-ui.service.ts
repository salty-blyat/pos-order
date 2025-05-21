import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";

@Injectable({
  providedIn: "root",
})
export class CardUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, "", "", "480px", "480px", "480px", "450px");
  }
}
