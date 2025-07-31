import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
const routes: Routes = [
   {
      path: "",
      redirectTo: "",
      pathMatch: "full",
   },
   {
      path: "",
      component: AppComponent,
   },
   {
      path: "**",
      component: AppComponent,
   },

   // { path: '**', component: AppComponent },
];

@NgModule({
   imports: [RouterModule.forRoot(routes, { useHash: false })],
   exports: [RouterModule],
})
export class AppRoutingModule {}
