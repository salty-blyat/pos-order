import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RedirectComponent } from "./redirect/redirect.component";
import { RouteGuardService } from "./helpers/route-guard.service";
import { PageComponent } from "./pages/page.component";
import { HomeComponent } from "./pages/home/home.component";
import { SettingComponent } from "./pages/setting/setting.component";
import { LookupTypeComponent } from "./pages/lookup/lookup-type.component";
import { LookupItemListComponent } from "./pages/lookup/lookup-item/lookup-item-list.component";
import { AutoNumberSectionComponent } from "./pages/system-setting/auto-number-section.component";
import { CompanySectionComponent } from "./pages/system-setting/company-section.component";
import { SystemSettingComponent } from "./pages/system-setting/system-setting.component";
import { ReportGroupListComponent } from "./pages/report-group/report-group-list.component";
import { CurrencyListComponent } from "./pages/currency/currency-list.component";
import { AutoNumberListComponent } from "./pages/auto-number/auto-number-list.component";
import { ReportViewComponent } from "./pages/report/report-view.component";
import { ReportGroupMenuComponent } from "./pages/report-group/report-group-menu.component";
import { BlockListComponent } from "./pages/block/block-list.component";
import { RoomTypeListComponent } from "./pages/room-type/room-type-list.component";
import { RoomListComponent } from "./pages/room/room-list.component";
import { TagGroupListComponent } from "./pages/tag/tag-group-list.component";
import { MemberListComponent } from "./pages/member/member-list.component";
import { ItemListComponent } from "./pages/item/item-list.component";
import { ItemTypeListComponent } from "./pages/item-type/item-type-list.component";
import { MemberLevelListComponent } from "./pages/member-level/member-level-list.component";
import { UnitListComponent } from "./pages/unit/unit-list.component";
import { ItemUnitListComponent } from "./pages/item-unit/item-unit-list.component";
import { GroupListComponent } from "./pages/group/group-list.component";
import { RoomChargeTypeListComponent } from "./pages/room-charge-type/room-charge-type-list.component";
import { ChargeListComponent } from "./pages/charge/charge-list.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  {
    path: "",
    component: PageComponent,
    canActivate: [RouteGuardService],
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "member",
        component: MemberListComponent,
      },
      {
        path: "room",
        component: RoomListComponent,
      },
      {
        path: "setting",
        component: SettingComponent,
      },
      {
        path: "setting/lookup",
        component: LookupTypeComponent,
        children: [
          { path: "", pathMatch: "full", redirectTo: "/setting/lookup/1" },
          {
            path: ":id",
            component: LookupItemListComponent,
          },
        ],
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Lookup", url: null },
        ],
      },
      {
        path: "report",
        component: ReportGroupMenuComponent,
      },
      {
        path: "report/:id",
        component: ReportViewComponent,
      },
      {
        path: "setting/report",
        component: ReportGroupListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Report", url: null },
        ],
      },
      {
        path: "setting/currency",
        component: CurrencyListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Currency", url: null },
        ],
      },
      {
        path: "setting/auto-number",
        component: AutoNumberListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "AutoNumber", url: null },
        ],
      },
      {
        path: "setting/system-setting",

        redirectTo: "/setting/system-setting/company-section",
        pathMatch: "full",
      },
      {
        path: "setting/system-setting",
        component: SystemSettingComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "SystemSetting", url: null },
        ],
        children: [
          {
            path: "auto-number-section",
            component: AutoNumberSectionComponent,
          },
          {
            path: "company-section",
            component: CompanySectionComponent,
          },
        ],
      },
      {
        path: "setting/currency",
        component: CurrencyListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Currency", url: null },
        ],
      },
      {
        path: "setting/auto-number",
        component: AutoNumberListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "AutoNumber", url: null },
        ],
      },
      {
        path: "setting/room-type",
        component: RoomTypeListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "RoomType", url: null },
        ],
      },
      {
        path: "setting/block",
        component: BlockListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Block", url: null },
        ],
      },
      {
        path: "setting/member-level",
        component: MemberLevelListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "MemberLevel", url: null },
        ],
      },
      {
        path: "setting/unit",
        component: UnitListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Unit", url: null },
        ],
      },
      {
        path: "setting/group",
        component: GroupListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Group", url: null },
        ],
      },
      {
        path: "setting/item-unit",
        component: ItemUnitListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "ItemUnit", url: null },
        ],
      },
      {
        path: "setting/item",
        component: ItemListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Item", url: null },
        ],
      },
      {
        path: "setting/item-type",
        component: ItemTypeListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "ItemType", url: null },
        ],
      },
      
      {
        path: "setting/room-charge-type",
        component: RoomChargeTypeListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "RoomChargeType", url: null },
        ],
      },
      {
        path: "setting/charge",
        component: ChargeListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Charge", url: null },
        ],
      },
      
    ],
  },
  {
    path: "redirect/:requestId",
    component: RedirectComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
