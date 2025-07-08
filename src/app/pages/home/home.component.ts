 
import { Component,  ViewEncapsulation } from "@angular/core";

 
@Component({
  selector: "app-home",
    template: `  
      <nz-layout>
        <nz-header nz-flex nzVertical>
          <div nz-flex nzAlign="center" nzGap="small">
            <div>
              <h6>hiii logo here =</h6>
            </div>
            <div>
              <nz-input-group nzSearch [nzAddOnAfter]="suffixButton" class="search-input">
                <input type="text" nz-input placeholder="Search" />
              </nz-input-group>
              <ng-template #suffixButton>
                <button nz-button  nzSearch><nz-icon nzType="search" /></button>
              </ng-template>
            </div>
          </div>
          <div>
            <nz-radio-group nzButtonStyle="solid"  class='category-radio'>
              <label nz-radio-button nzValue="A">Hangzhou</label>
              <label nz-radio-button nzValue="B">Shanghai</label>
              <label nz-radio-button nzValue="C">Beijing</label>
              <label nz-radio-button nzValue="D">Chengdu</label>
            </nz-radio-group>
          </div>
        </nz-header>

        <nz-content>Content</nz-content> 
      </nz-layout> 
    `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles:[` 
  nz-layout{
    background-color: white !important;
  }

  .category-radio{
    display:flex !important;
    gap: 8px !important;
  }
  .search-input{
    max-width: 200px;  
    input{
      border-radius: 12px 0 0 12px !important;
    }
    button{
      border-radius: 0 12px 12px 0 !important;

    }
  }
  
    nz-layout {
      padding: 8px;
      height: calc(100vh - 70px)
    }
    `],
   encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HomeComponent   { 
  isLoading = false;
  searchTerm = ''; 
}
