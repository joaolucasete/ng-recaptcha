import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { parseLangFromHref } from "../../parse-lang-from-href";
import { InvisibleDemoComponent } from "./invisible-demo.component";
import { settings } from "./invisible-demo.data";
import { CaptchaProviderType, MultiCaptchaModule } from "multi-captcha";

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
      {},
      {
        // provider: CaptchaProviderType.Hcaptcha,
        // siteKey: "8a1c02a8-8938-4392-b62e-424896d8af6e", // hcaptcha
        provider: CaptchaProviderType.Recaptcha,
        siteKey: "6LdfItkZAAAAAIszILpBAKRqXGKo80WxGNyu2GSs", // recaptcha
        // provider: CaptchaProviderType.Turnstile,
        // siteKey: "0x4AAAAAAA_pTcVw10OrUibR", // turnstile
      },
    ),
    CommonModule,
  ],
  providers: [],
})
export class DemoModule {}
