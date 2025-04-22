import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BaseUiService } from '../../utils/services/base-ui.service';
import {FloorOperationComponent} from "./floor-operation.component";
import {FloorDeleteComponent} from "./floor-delete.component";

@Injectable({
    providedIn: 'root',
})
export class FloorUiService extends BaseUiService {
    constructor(modalService: NzModalService) {
        super(
            modalService,
            FloorOperationComponent,
            FloorDeleteComponent,
            '580px',
            '500px',
            '500px',
            '450px'
        );
    }
    override showAdd(blockId: number, componentId: any = '') {
        this.modalService.create({
            nzContent: FloorOperationComponent,
            nzData: {blockId},
            nzFooter: null,
            nzClosable: true,
            nzWidth: '500px',
            nzBodyStyle: { paddingBottom: '10px' },
            nzMaskClosable: false,
            nzOnOk: (e: any) => {
                this.refresher.emit({ key: 'added', value: e.model});
            }
        });
    }
}
