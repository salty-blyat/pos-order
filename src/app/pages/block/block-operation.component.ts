import {Component, ViewEncapsulation} from '@angular/core';
import {  FormBuilder, } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { BaseOperationComponent } from '../../utils/components/base-operation.component';
import {BlockUiService} from "./block-ui.service";
import {Block, BlockService} from "./block.service";
import {CommonValidators} from "../../utils/services/common-validators";
import {SETTING_KEY, SystemSettingService} from "../system-setting/system-setting.service";

@Component({
    selector: 'app-block-operation',
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
                    (ngSubmit)="onSubmit()"
                    [nzAutoTips]="autoTips"
            >
                <nz-form-item>
                    <nz-form-label [nzSm]="5" [nzXs]="24" nzRequired>
                        {{ 'Code' | translate }}
                    </nz-form-label>
                    <nz-form-control [nzSm]="17" [nzXs]="24" nzHasFeedback>
                        <input nz-input formControlName="code" placeholder="{{
                      editableCode ? ('New Block No' | translate) : ''
                    }}"/>
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
                            'Address' | translate
                        }}
                    </nz-form-label>
                    <nz-form-control [nzSm]="17" [nzXs]="24" nzErrorTip="">
                        <textarea nz-input formControlName="address" rows="3"></textarea>
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
                    <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
                    {{ 'Save' | translate }}
                </button>
                <button nz-button nzType="default" (click)="cancel()">
                    {{ 'Cancel' | translate }}
                </button>
            </div>
            <div *ngIf="modal?.isView">
                <a *ngIf="!isLoading()">
                    <i nz-icon nzType="edit" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Edit' | translate }}</span>
                </a>
                <nz-divider nzType="vertical" *ngIf="!isLoading()"></nz-divider>
                <a
                        nz-typography
                        nzType="danger"
                        *ngIf="!isLoading()"
                >
                    <i nz-icon nzType="delete" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Delete' | translate }}</span>
                </a>
                <nz-divider nzType="vertical" *ngIf="!isLoading()"></nz-divider>
                <a nz-typography (click)="cancel()" style="color: gray;">
                    <i nz-icon nzType="close" nzTheme="outline"></i>
                    <span class="action-text"> {{ 'Close' | translate }}</span>
                </a>
            </div>
        </div>
    `,
    styleUrls: ['../../../assets/scss/operation.style.scss'],
    standalone: false,
    encapsulation: ViewEncapsulation.None,
})
export class BlockOperationComponent extends BaseOperationComponent<Block> {
    constructor(
        fb: FormBuilder,
        ref: NzModalRef<BlockOperationComponent>,
        override service: BlockService,
        override uiService: BlockUiService,
        private systemSettingService: SystemSettingService
    ) {
        super(fb, ref, service, uiService);
    }
    editableCode: boolean = false;
    override ngOnInit(): void {
        setTimeout(() => {
            let setting = this.systemSettingService.current.items.find(
                (item) => item.key === SETTING_KEY.BlockAutoId
            );
            if (setting) this.editableCode = +setting.value! !== 0;
            if(this.editableCode){
                this.frm.get('code')?.disable();
            }
        },50);
        super.ngOnInit();
    }


    override initControl(): void {
        const {
            required,
            nameMaxLengthValidator,
            nameExistValidator,
        } = CommonValidators;

        this.frm = this.fb.group({
            code: [{ value: null, disabled: this.editableCode }, [required]],
            name: [
                null,
                [required, nameMaxLengthValidator],
                [nameExistValidator(this.service, this.modal?.id)],
            ],
            description: [null],
            address: [null],
        });
    }



    override setFormValue(): void {
         this.frm.setValue({
             code:this.model.code,
             name:this.model.name,
             description:this.model.description,
             address:this.model.address,
         })
    }
}
