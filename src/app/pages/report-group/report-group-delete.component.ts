import {Component, ViewEncapsulation} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ReportGroup, ReportGroupService} from "./report-group.service";
import {BaseDeleteComponent} from "../../utils/components/base-delete.component";
import {ReportGroupUiService} from "./report-group-ui.service";

@Component({
  selector: 'app-report-group-delete',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="modal?.id">{{ 'Remove' | translate }}  {{ (model?.name || ('Loading'|translate)) }}</span>
      </div>
      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <div *ngIf="errMessage() && !isLoading()" nz-row nzJustify="center" style="margin:2px 0">
              <span nz-typography nzType="danger" style="position: absolute">{{ errMessage() | translate }}</span>
          </div>
          <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips">
              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
                          "Name" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
                      <input nz-input formControlName="name"/>
                  </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                  <nz-form-label [nzSm]="6" [nzXs]="24">{{
                          "Note" | translate
                      }}
                  </nz-form-label>
                  <nz-form-control [nzSm]="15" [nzXs]="24" nzErrorTip="">
              <textarea
                      nz-input
                      type="text"
                      formControlName="note"
                      rows="5"
              ></textarea>
                  </nz-form-control>
              </nz-form-item>
          </form>
      </div>
      <div *nzModalFooter>
          <button *ngIf="!errMessage() && model?.name" nz-button nzDanger nzType="primary" [disabled]="!frm.valid"
                  (click)="onSubmit($event)">
              <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
              {{ "Delete" | translate }}
          </button>
          <button nz-button nzType="default" (click)="cancel()">
              {{ "Cancel" | translate }}
          </button>
      </div>
  `,
  styleUrls: ['../../../assets/scss/operation.style.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class ReportGroupDeleteComponent extends BaseDeleteComponent<ReportGroup> {
  constructor(
    fb: FormBuilder,
    ref: NzModalRef<ReportGroupDeleteComponent>,
    service: ReportGroupService,
    uiService: ReportGroupUiService
  ) {
    super(service, uiService, ref, fb);
  }
}
