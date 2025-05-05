import {Injectable} from "@angular/core";
import {BaseUiService} from "../../../utils/services/base-ui.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {BillingCycleOperationComponent} from "./billing-cycle-operation.component";
import {BillingCycleDeleteComponent} from "./billing-cycle-delete.component";

@Injectable({
  providedIn: 'root',
})

export class BillingCycleUiService extends BaseUiService{
  constructor(modalService: NzModalService) {
    super(modalService, BillingCycleOperationComponent, BillingCycleDeleteComponent, "450px", "450px", "450px", "450px");
  }
}