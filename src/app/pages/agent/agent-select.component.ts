import {
  Component,
  computed,
  forwardRef,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { BaseSelectComponent } from "../../utils/components/base-select.component";
import { AuthService } from "../../helpers/auth.service";
import { Agent, AgentService } from "./agent.service";
import { AgentUiService } from "./agent-ui.service";
import { QueryParam } from "../../utils/services/base-api.service";
import { AuthKeys } from "../../const";

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgentSelectComponent),
      multi: true,
    },
  ],
  selector: "app-agent-select",
  template: `
    <nz-select
      nzShowSearch
      [nzDropdownRender]="actionItem"
      [nzServerSearch]="true"
      [(ngModel)]="selected"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="searchText.set($event); param().pageIndex = 1; search()"
      [nzDisabled]="disabled()"
    >
      <nz-option
        *ngIf="showAllOption()"
        [nzValue]="0"
        [nzLabel]="'AllAgent' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists()"
        [nzValue]="item?.id"
        [nzLabel]="item?.name + ''"
      >
      </nz-option>
      <nz-option *ngIf="isLoading()" nzDisabled nzCustomContent>
        <i nz-icon nzType="loading" class="loading-icon"></i>
        {{ "Loading" | translate }}
      </nz-option>
      <ng-template #actionItem>
        <a
          *ngIf="addOption() && isAgentAdd()"
          (click)="uiService.showAdd()"
          class="item-action"
        >
          <i nz-icon nzType="plus"></i> {{ "Add" | translate }}
        </a>
      </ng-template>
    </nz-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AgentSelectComponent extends BaseSelectComponent<Agent> {
  constructor(
    service: AgentService,
    override uiService: AgentUiService,
    private authService: AuthService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      service,
      uiService,
      sessionStorageService,
      "agent-filter",
      "all-agent"
    );
  }

  override param = signal<QueryParam>({
    pageSize: 10,
    pageIndex: 1,
    sorts: "",
    filters: "",
  });

  isAgentAdd = computed<boolean>(() => this.authService.isAuthorized(AuthKeys.APP__AGENT__ADD));
}
