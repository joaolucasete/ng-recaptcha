import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { examples } from "../../../bin/examples";

const routes: Routes = [
  {
    path: "invisible",
    loadChildren: () =>
      import(`../examples/invisible/invisible-demo.module`).then(
        // eslint-disable-next-line
        (m) => m.DemoModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class DemoWrapperRoutingModule {}
