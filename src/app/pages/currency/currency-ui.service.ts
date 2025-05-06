import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { CurrencyOperationComponent } from "./currency-operation.component";
import { CurrencyDeleteComponent } from "./currency-delete.component";

@Injectable({
  providedIn: "root",
})
export class CurrencyUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      CurrencyOperationComponent,
      CurrencyDeleteComponent,
      "540px",
      "540px",
      "540px",
      "450px"
    );
  }
}
