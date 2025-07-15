import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageComponent } from "./pages/page.component";
import { HomeComponent } from "./pages/home/home.component";
import { VerifyUserComponent } from "./pages/verify-user/verify-user.component";
import { ServiceComponent } from "./pages/service/service.component";
import { RouteGuardService } from "./helpers/route-guard.service";
import { ServiceOperationComponent } from "./pages/service/service-operation.component";
import { HistoryDetailComponent } from "./pages/history/history-detail.component";
import { HistoryComponent } from "./pages/history/history.component";
import { NotFoundPageComponent } from "./pages/not-found/not-found.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/not-found" },
  {
    path: "",
    component: PageComponent,
    // canActivate: [RouteGuardService],
    children: [
      {
        path: "verify-user/:tenantCode/:uuid",
        component: VerifyUserComponent,
      },
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
        path: "history",
        component: HistoryComponent,
      },
      {
        path: "history/:id",
        component: HistoryDetailComponent,
      }
    ]
  },
  {
    path: "**",
    component: NotFoundPageComponent,
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { } 
