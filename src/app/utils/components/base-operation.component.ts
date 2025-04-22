import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CommonValidators } from '../services/common-validators';
import { BaseUiService } from '../services/base-ui.service';
import { BaseApiService } from '../services/base-api.service';
import { Observable } from 'rxjs';

interface SharedDomain {
  id?: number;
  name?: string;
}
@Component({
  template: '',
  standalone: false
})
export class BaseOperationComponent<T extends SharedDomain> implements OnInit {
  constructor(
    protected fb: FormBuilder,
    protected ref: NzModalRef<any>,
    protected service: BaseApiService<any>,
    protected uiService: BaseUiService
  ) { }
  readonly modal: any = inject(NZ_MODAL_DATA);
  loading = false;
  frm!: FormGroup;
  model!: T;
  autoTips: Record<any, any> = CommonValidators.autoTips;
  refreshSub$: any;

  ngOnInit(): void {
    if (this.loading) return;
    this.initControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === 'edited') {
          this.loading = true;
          this.service.find(this.modal?.id).subscribe({
            next: (result: T) => {
              this.model = result;
              this.setFormValue();
              this.loading = false;
            },
            error: (err: any) => {
              console.log(err);
            },
          });
        } else {
          this.ref.triggerCancel().then();
        }
      });
    }
    if (this.modal?.id) {
      this.loading = true;
      this.service.find(this.modal?.id).subscribe((result: T) => {
        this.model = result;
        this.setFormValue();
        this.loading = false;
      });
    }
  }

  onSubmit(e?: any) {
    if (this.frm.valid && !this.loading) {
      this.loading = true;
      let operation$: Observable<T> = this.service.add(this.frm.getRawValue());
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        operation$.subscribe({
          next: (result: T) => {
            this.model = result;
            this.loading = false;
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    }
  }
  cancel() {
    this.ref.triggerCancel().then();
  }
  initControl(): void { }
  setFormValue(): void { }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
