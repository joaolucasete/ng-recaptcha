import { Injectable } from "@angular/core";
import { CaptchaProvider, CaptchaProviderType, CaptchaRenderOptions } from "../tokens";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Injectable({
  providedIn: "root",
})
export class RecaptchaV2Provider implements CaptchaProvider {
  readonly name = CaptchaProviderType.Recaptcha;
  url = "https://www.google.com/recaptcha/api.js?trustedtypes=true";

  callbackHandler(onLoaded: Function) {
    return () => onLoaded(window.grecaptcha);
  }

  render(element: HTMLElement, options: CaptchaRenderOptions): number {
    return window.grecaptcha.render(element, {
      sitekey: options.sitekey,
      callback: options.callback,
      size: "invisible",
      "expired-callback": options["expired-callback"],
      "error-callback": options["error-callback"],
    });
  }

  execute(widgetId?: number): void {
    window.grecaptcha.execute(widgetId);
  }

  reset(widgetId?: number): void {
    window.grecaptcha.reset(widgetId);
  }

  getResponse(widgetId?: number): string | null {
    return window.grecaptcha.getResponse(widgetId);
  }
}
