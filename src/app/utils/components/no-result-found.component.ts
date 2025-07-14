import { Component } from "@angular/core";


@Component({
  selector: "app-no-result-found",
  template: `
    <div class="container">
      <h5 style="font-size: 36px; margin-bottom: 6px;">
        <nz-icon
          nzType ='file-search'
          nzTheme="outline"
        ></nz-icon>
      </h5>
      <h5>
        {{
            "No Data Found" | translate 
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
  standalone: false,
})
export class NoResultFoundComponent   {
 
}
