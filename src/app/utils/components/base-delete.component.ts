import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonValidators } from '../services/common-validators';
import { finalize, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../services/base-api.service';
import { BaseUiService } from '../services/base-ui.service';

interface SharedDomain {
  id?: number;
  name?: string;
}

@Component({
    selector: 'app-base-delete',
    template: '',
    standalone: false
})
export class BaseDeleteComponent<T extends SharedDomain> implements OnInit {
  constructor(
    private service: BaseApiService<T>,
    public uiService: BaseUiService,
    private ref: NzModalRef<any>,
    protected fb: FormBuilder
  ) {}
  readonly modal: { id: number } = inject(NZ_MODAL_DATA);
  isLoading = signal<boolean>(false);
  errMessage = signal<string>('');
  frm!: FormGroup;
  model!: T;
  autoTips: Record<any, any> = CommonValidators.autoTips;
  ngOnInit(): void {
    this.initControl();
    if (this.modal.id) {
      this.isLoading.set(true);
      const canRemove$: Observable<any> = this.service.inused(this.modal.id);
      const find$: Observable<any> = canRemove$.pipe(
        switchMap((x: any) => {
          if (!x.can) {
            this.errMessage.set(x.message);
            this.frm.disable();
          }
          return this.service.find(this.modal.id);
        })
      );
      find$
        .pipe(finalize(() => (this.isLoading.set(false))))
        .subscribe((result: T) => {
          this.model = result;
          this.setFormValue();
        });
    }
  }

  onSubmit(e?: any) {
    if (this.isLoading()) {
      return;
    }
    if (!this.frm.valid) {
      return;
    }
    this.isLoading.set(true);
    this.model.id = this.modal?.id;
    if (e.detail == 1) {
      this.service
        .delete({ ...this.frm.getRawValue(), id: this.modal?.id })
        .subscribe({
          next: () => {
            this.ref.triggerOk().then();
            this.isLoading.set(false);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
              this.isLoading.set(false);
          },
        });
    }
  }

  cancel() {
    this.ref.triggerCancel().then();
  }

  initControl(): void {}
  setFormValue(): void {}
}
