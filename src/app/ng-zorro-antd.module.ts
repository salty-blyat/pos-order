import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import {
  DashboardOutline,
  FileSearchOutline,
  FormOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
} from '@ant-design/icons-angular/icons'; import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzFormModule } from 'ng-zorro-antd/form'; import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input'; import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button'; import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzMessageModule } from 'ng-zorro-antd/message';
const icons = [
  MenuFoldOutline,
  FileSearchOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
];
@NgModule({
  imports: [NzIconModule],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
  exports: [NzIconModule,
    NzLayoutModule,
    NzDropDownModule,
    NzGridModule, NzRadioModule, NzModalModule, NzResultModule,
    NzAffixModule,
    NzFormModule,
    NzSpinModule,
    NzSelectModule, NzDividerModule,
    NzFormModule,
    NzInputModule, NzButtonModule, NzMessageModule, NzBadgeModule

  ],
})
export class NgZorroAntdModule { }
