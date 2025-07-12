import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageComponent } from "./pages/page.component";
import { HomeComponent } from "./pages/home/home.component";
import { VerifyUserComponent } from "./pages/verify-user/verify-user.component";
import { ServiceComponent } from "./pages/service/service.component";
import { RouteGuardService } from "./helpers/route-guard.service";
import { ServiceOperationComponent } from "./pages/service/service-operation.component";
import { HistoryComponent } from "./pages/history/history.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/verify-user" },
  {
    path: "",
    component: PageComponent,
    // canActivate: [RouteGuardService],
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "service/:id",
        component: ServiceComponent,
      },
      {
        path: "service/:id/operation",
        component: ServiceOperationComponent,
      },
      {
        path: "verify-user/:uuid",
        component: VerifyUserComponent,
      },
      {
        path: "history",
        component: HistoryComponent,
      }

    ]
  },
  // {
  //   path: "redirect/:requestId",
  //   component: RedirectComponent,
  // },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
