import { Injectable } from "@angular/core";
import { CaptchaRenderOptions, ICaptchaProvider } from "../interfaces";
import { CaptchaProvider } from "../tokens";

@Injectable({
  providedIn: "root",
})
export class RecaptchaV2Provider implements ICaptchaProvider {
  readonly name = CaptchaProvider.Recaptcha;
  url = "https://www.google.com/recaptcha/api.js";

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
