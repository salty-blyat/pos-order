import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BaseUiService } from '../../utils/services/base-ui.service';
import { BranchDeleteComponent } from './branch-delete.component';
import { BranchOperationComponent } from './branch-operation.component';
@Injectable({
  providedIn: 'root',
})
export class BranchUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      BranchOperationComponent,
      BranchDeleteComponent,
      '580px',
      '580px',
      '580px',
      '450px'
    );
  }
}
