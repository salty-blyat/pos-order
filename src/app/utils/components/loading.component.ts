import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
    <nz-spin
      *ngIf="loading"
      style="position: absolute; top: 50%; left: 50%"
    ></nz-spin>
  `,
    standalone: false
})
export class LoadingComponent {
  @Input() loading = false;
}
