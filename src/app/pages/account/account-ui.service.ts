import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { AccountDeleteComponent } from "./account-delete.component";
import { AccountOperationComponent } from "./account-operation.component";

@Injectable({
  providedIn: "root",
})
export class AccountUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      AccountOperationComponent,
      AccountDeleteComponent,
      "480px",
      "480px",
      "480px",
      "450px"
    );
  }
}
