import { NgModule, ModuleWithProviders, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CaptchaComponent } from "./captcha.component";
import { CaptchaLoaderService } from "./catpcha-loader.service";
import {
  CAPTCHA_LOADER_OPTIONS,
  CAPTCHA_PROVIDER,
  CaptchaLoaderOptions,
  CaptchaProvider,
  SELECTED_CAPTCHA_PROVIDER,
} from "./tokens";
import { ICaptchaProvider } from "./interfaces";
import { RecaptchaV2Provider } from "./providers/recaptcha-v2.provider";
import { HcaptchaProvider } from "./providers/hcaptcha.provider";
import { TurnstileProvider } from "./providers/turnstile.provider";

export function captchaProviderFactory(selectedProvider: CaptchaProvider, injector: Injector): ICaptchaProvider {
  switch (selectedProvider) {
    case CaptchaProvider.Hcaptcha:
      return injector.get(HcaptchaProvider);
    case CaptchaProvider.Turnstile:
      return injector.get(TurnstileProvider);
    case CaptchaProvider.Recaptcha:
    default:
      return injector.get(RecaptchaV2Provider);
  }
}

@NgModule({
  declarations: [CaptchaComponent],
  imports: [CommonModule],
  exports: [CaptchaComponent],
  providers: [
    CaptchaLoaderService,
    RecaptchaV2Provider,
    HcaptchaProvider,
    TurnstileProvider,
    {
      provide: ICaptchaProvider,
      useFactory: captchaProviderFactory,
      deps: [SELECTED_CAPTCHA_PROVIDER, Injector],
    },
  ],
})
export class MultiCaptchaModule {
  static forRoot(
    options?: CaptchaLoaderOptions,
    defaultProvider: CaptchaProvider = CaptchaProvider.Recaptcha,
  ): ModuleWithProviders<MultiCaptchaModule> {
    return {
      ngModule: MultiCaptchaModule,
      providers: [
        {
          provide: CAPTCHA_LOADER_OPTIONS,
          useValue: options || {},
        },
        {
          provide: SELECTED_CAPTCHA_PROVIDER,
          useValue: defaultProvider,
        },
      ],
    };
  }
}
