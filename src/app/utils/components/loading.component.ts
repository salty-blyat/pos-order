import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
    <nz-spin
      class="loading"
    ></nz-spin>
  `,
    styles: [`
      .loading{
        position: absolute; 
        top: 50%; 
        left: 50%
      } 
    `],
    standalone: false
})
export class LoadingComponent {
}
