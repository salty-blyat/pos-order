import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";


@Injectable({ providedIn: "root" })
export class HomeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, "", "", "450px", "450px", "450px", "450px");
  }

  
}
