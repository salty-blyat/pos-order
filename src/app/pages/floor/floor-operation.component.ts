import { Component } from '@angular/core';
import {  FormBuilder, } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseOperationComponent } from '../../utils/components/base-operation.component';
import {CommonValidators} from "../../utils/services/common-validators";
import {Floor, FloorService} from "./floor.service";
import {FloorUiService} from "./floor-ui.service";

@Component({
    selector: 'app-floor-operation',
    template: `
        <div *nzModalTitle class="modal-header-ellipsis">
            <span *ngIf="!modal?.id">{{ 'Add' | translate }}</span>
            <span *ngIf="modal?.id && !modal?.isView"
            >{{ 'Edit' | translate }}
                {{ model?.name || ('Loading' | translate) }}</span
            >
            <span *ngIf="modal?.id && modal?.isView">{{
                    model?.name || ('Loading' | translate)
                }}</span>
        </div>
        <div class="modal-content">
            <app-loading *ngIf="isLoading()"/>
            <form
                    nz-form
                    [formGroup]="frm"
                    
                    [nzAutoTips]="autoTips"
            >
                <nz-form-item>
                    <nz-form-label [nzSm]="5" [nzXs]="24" nzRequired>{{
                            'Block' | translate
                        }}
                    </nz-form-label>
                    <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
                        <app-block-select formControlName="blockId"></app-block-select>
                    </nz-form-control>
                </nz-form-item>
                <nz-form-item>
                    <nz-form-label [nzSm]="5" [nzXs]="24" nzRequired>{{
                            'Name' | translate
                        }}
                    </nz-form-label>
                    <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                        <input nz-input formControlName="name"/>
                    </nz-form-control>
                </nz-form-item>
                <nz-form-item>
                    <nz-form-label [nzSm]="5" [nzXs]="24">{{
                            'Description' | translate
                        }}
                    </nz-form-label>
                    <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
                        <textarea nz-input formControlName="description" rows="3"></textarea>
                    </nz-form-control>
                </nz-form-item>
            </form>
        </div>
        <div *nzModalFooter>
            <div *ngIf="!modal?.isView">
                <button
                        nz-button
                        nzType="primary"
                        [disabled]="!frm.valid"
                        (click)="onSubmit($event)"
                >
                    <i *ngIf="isLoading" nz-icon nzType="loading"></i>
                    {{ 'Save' | translate }}
                </button>
                <button nz-button nzType="default" (click)="cancel()">
                    {{ 'Cancel' | translate }}
                </button>
            </div>
            <div *ngIf="modal?.isView">
                <a *ngIf="!isLoading" (click)="uiService.showEdit(model.id!)">
                    <i nz-icon nzType="edit" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Edit' | translate }}</span>
                </a>
                <nz-divider nzType="vertical" *ngIf="!isLoading"></nz-divider>
                <a
                        nz-typography
                        nzType="danger"
                        *ngIf="!isLoading"
                        (click)="uiService.showDelete(model.id!)"
                >
                    <i nz-icon nzType="delete" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Delete' | translate }}</span>
                </a>
                <nz-divider nzType="vertical" *ngIf="!isLoading"></nz-divider>
                <a nz-typography (click)="cancel()" style="color: gray;">
                    <i nz-icon nzType="close" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Close' | translate }}</span>
                </a>
            </div>
        </div>
    `,
    styleUrls: ['../../../assets/scss/operation_page.scss'],
    standalone: false
})
export class FloorOperationComponent extends BaseOperationComponent<Floor> {
    constructor(
        fb: FormBuilder,
        ref: NzModalRef<FloorOperationComponent>,
        override service: FloorService,
        override uiService: FloorUiService
    ) {
        super(fb, ref, service, uiService);
    }
    override ngOnInit(): void {
        super.ngOnInit();
    }


    override initControl(): void {
        const {
            required,
            nameMaxLengthValidator,
            nameExistValidator,
        } = CommonValidators;

        this.frm = this.fb.group({
            name: [
                null,
                [required, nameMaxLengthValidator],
                [nameExistValidator(this.service, this.modal?.id, 'name', this.modal?.blockId)],

            ],
            blockId: [{ value: this.modal?.blockId, disabled: false }],
            description: [null],
        });

    }



    override setFormValue(): void {
        this.frm.setValue({
            name:this.model.name,
            blockId:this.model.blockId,
            description:this.model.description,
        })
    }
}
