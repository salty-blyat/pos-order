import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RedirectComponent } from "./redirect/redirect.component";
import { RouteGuardService } from "./helpers/route-guard.service";
import { PageComponent } from "./pages/page.component"; 
import { HomeComponent } from "./pages/home/home.component";

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
      }
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
