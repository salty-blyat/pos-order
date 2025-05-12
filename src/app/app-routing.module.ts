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
import { TagGroupListComponent } from "./pages/tag/tag-group-list.component";
import { LocationListComponent } from "./pages/location/location-list.component";
import { BranchListComponent } from "./pages/branch/branch-list.component";
import { AgentListComponent } from "./pages/agent/agent-list.component";
import { MemberClassListComponent } from "./pages/member-class/member-class-list.component";
import { OfferGroupListComponent } from "./pages/offer-group/offer-group-list.component";
import { MemberListComponent } from "./pages/member/member-list.component";
import { AccountListComponent } from "./pages/account/account-list.component";
import { OfferListComponent } from "./pages/offer/offer-list.component";
import { RedemptionListComponent } from "./pages/redemption/redemption-list.component";

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
      // {
      //   path: "member",
      //   component: MemberListComponent,
      // },
      {
        path: "agent",
        component: AgentListComponent,
      },
      {
        path: "setting",
        component: SettingComponent,
      },
      {
        path: "report",
        component: ReportGroupMenuComponent,
      },
      {
        path: "offer",
        component: OfferListComponent,
      },
      {
        path: "account",
        component: AccountListComponent,
      },
      {
        path: "member",
        component: MemberListComponent,
      },
      {
        path: "redemption",
        component: RedemptionListComponent,
      },
      {
        path: "report/:id",
        component: ReportViewComponent,
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
        path: "setting/offer-group",
        component: OfferGroupListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "OfferGroup", url: null },
        ],
      },
      {
        path: "setting/member-class",
        component: MemberClassListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "MemberClass", url: null },
        ],
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
        path: "setting/tag",
        component: TagGroupListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Tag", url: null },
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
        path: "setting/auto-number",
        component: AutoNumberListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "AutoNumber", url: null },
        ],
      },
      {
        path: "setting/location",
        component: LocationListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Location", url: null },
        ],
      },
      {
        path: "setting/branch",
        component: BranchListComponent,
        data: [
          { index: 0, label: "Setting", url: "/setting" },
          { index: 1, label: "Branch", url: null },
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
