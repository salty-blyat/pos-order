import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AutoNumberOperationComponent } from './auto-number-operation.component';
import { AutoNumberDeleteComponent } from './auto-number-delete.component';
import { BaseUiService } from '../../utils/services/base-ui.service';


@Injectable({
  providedIn: 'root',
})
export class AutoNumberUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(
      modalService,
      AutoNumberOperationComponent,
      AutoNumberDeleteComponent,
      '480px',
      '480px',
      '480px',
      '480px'
    );
  }
}
