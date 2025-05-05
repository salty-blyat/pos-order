import {Injectable} from "@angular/core";
import {BaseUiService} from "../../../utils/services/base-ui.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Injectable({
  providedIn: 'root',
})

export class MeterReadingUiService extends BaseUiService{
  constructor(modalService: NzModalService) {
    super(modalService, "", "", "" , "", "", "");
  }
}