import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SuccessPopupComponent } from '../../utils/components/success-popup.component';

@Injectable({ providedIn: 'root' })
export class ServiceUiService {
    constructor(
        private modalService: NzModalService,
    ) { }
    showSuccess(): void {
        this.modalService.create({
            nzContent: SuccessPopupComponent,
            nzFooter: null,
            nzStyle: {
                top: " 15%"
            },
            nzClosable: true,
            nzWidth: '400px',
            nzMaskClosable: false,
        });
    }
} 