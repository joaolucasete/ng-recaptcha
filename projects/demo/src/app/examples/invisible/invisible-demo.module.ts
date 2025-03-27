import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { parseLangFromHref } from "../../parse-lang-from-href";
import { InvisibleDemoComponent } from "./invisible-demo.component";
import { settings } from "./invisible-demo.data";
import { CaptchaProvider, MultiCaptchaModule } from "multi-captcha";

const routes: Routes = [
  {
    path: "",
    component: InvisibleDemoComponent,
    data: { page: settings },
  },
];

@NgModule({
  declarations: [InvisibleDemoComponent],
  imports: [
    RouterModule.forChild(routes),
    MultiCaptchaModule.forRoot(
      {
        onBeforeLoad(url) {
          const langOverride = parseLangFromHref();
          if (langOverride) url.searchParams.set("hl", langOverride);

          return { url };
        },
      },
      CaptchaProvider.Hcaptcha,
    ),
    CommonModule,
  ],
  providers: [],
})
export class DemoModule {}
