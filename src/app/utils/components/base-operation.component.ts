import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
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
export class BaseOperationComponent<T extends SharedDomain> implements OnInit , OnDestroy{
  constructor(
    protected fb: FormBuilder,
    protected ref: NzModalRef<any>,
    protected service: BaseApiService<any>,
    protected uiService: BaseUiService
  ) { }
  readonly modal: any = inject(NZ_MODAL_DATA);
  isLoading = signal<boolean>(false);
  frm!: FormGroup;
  model!: T;
  autoTips: Record<any, any> = CommonValidators.autoTips;
  refreshSub$: any;

  ngOnInit(): void { 
    if (this.isLoading()) return;
    this.initControl();
    if (this.modal?.isView) {
      this.frm.disable();
      this.refreshSub$ = this.uiService.refresher.subscribe((e) => {
        if (e.key === 'edited') {
          this.isLoading.set(true);
          this.service.find(this.modal?.id).subscribe({
            next: (result: T) => { 
              this.model = result;
              this.setFormValue();
              this.isLoading.set(false);
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
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe((result: T) => {
        this.model = result;
        this.setFormValue();
        this.isLoading.set(false);
      });
    }
  }

  onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading()) {
      let operation$: Observable<T> = this.service.add(this.frm.getRawValue());
      if (this.modal?.id) {
        operation$ = this.service.edit({
          ...this.frm.getRawValue(),
          id: this.modal?.id,
        });
      }
      if (e.detail === 1 || e.detail === 0) {
        this.isLoading.set(true);
        operation$.subscribe({
          next: (result: T) => {
            this.model = result;
            this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
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
