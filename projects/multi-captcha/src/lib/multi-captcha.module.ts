import { NgModule, ModuleWithProviders, Injector } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CaptchaComponent } from "./captcha.component";
import { CaptchaLoaderService } from "./catpcha-loader.service";
import {
  CAPTCHA_LOADER_OPTIONS,
  CAPTCHA_SETTINGS,
  CaptchaLoaderOptions,
  CaptchaProvider,
  CaptchaProviderType,
  CaptchaSettings,
} from "./tokens";
import { RecaptchaV2Provider } from "./providers/recaptcha-v2.provider";
import { HcaptchaProvider } from "./providers/hcaptcha.provider";
import { TurnstileProvider } from "./providers/turnstile.provider";

export function captchaProviderFactory(settings: CaptchaSettings, injector: Injector): CaptchaProvider {
  switch (settings.provider) {
    case CaptchaProviderType.Hcaptcha:
      return injector.get(HcaptchaProvider);
    case CaptchaProviderType.Turnstile:
      return injector.get(TurnstileProvider);
    case CaptchaProviderType.Recaptcha:
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
      provide: CaptchaProvider,
      useFactory: captchaProviderFactory,
      deps: [CAPTCHA_SETTINGS, Injector],
    },
  ],
})
export class MultiCaptchaModule {
  static forRoot(options?: CaptchaLoaderOptions, settings?: CaptchaSettings): ModuleWithProviders<MultiCaptchaModule> {
    return {
      ngModule: MultiCaptchaModule,
      providers: [
        {
          provide: CAPTCHA_SETTINGS,
          useValue: settings || { provider: CaptchaProviderType.Recaptcha },
        },
        {
          provide: CAPTCHA_LOADER_OPTIONS,
          useValue: options || {},
        },
      ],
    };
  }
}
