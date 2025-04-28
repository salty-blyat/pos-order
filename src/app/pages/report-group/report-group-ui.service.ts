import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportGroupOperationComponent } from './report-group-operation.component';
import { ReportGroupDeleteComponent } from './report-group-delete.component';
import {BaseUiService} from "../../utils/services/base-ui.service";

@Injectable({ providedIn: 'root' })
export class ReportGroupUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService,ReportGroupOperationComponent, ReportGroupDeleteComponent, "450px", "450px", "450px", "450px" );
  }
}
