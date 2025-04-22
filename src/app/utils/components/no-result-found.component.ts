import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-no-result-found',
    template: `
    <div class="container">
      <h5 style="font-size: 36px; margin-bottom: 6px;">
        <i
          nz-icon
          [nzType]="branch === 0 ? 'info-circle' : 'file-search'"
          nzTheme="outline"
        ></i>
      </h5>
      <h5>
        {{
          branch === 0
            ? ('Please select branch!' | translate)
            : ('RowNotFound' | translate)
        }}
      </h5>
    </div>
  `,
    styles: [
        `
      .container {
        text-align: center;
        padding: 24px 0px;

        [nz-icon] {
          color: #adacac;
        }
      }
    `,
    ],
    standalone: false
})
export class NoResultFoundComponent implements OnInit {
  @Input() branch?: number;

  constructor() {}

  ngOnInit(): void {}
}
