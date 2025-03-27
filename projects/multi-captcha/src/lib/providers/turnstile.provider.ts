import { Injectable } from "@angular/core";
import { CaptchaProvider, CaptchaProviderType, CaptchaRenderOptions } from "../tokens";

declare global {
  interface Window {
    turnstile: any;
  }
}

@Injectable({
  providedIn: "root",
})
export class TurnstileProvider implements CaptchaProvider {
  readonly name = CaptchaProviderType.Turnstile;
  url = "https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha";

  callbackHandler(onLoaded: Function) {
    return () => onLoaded(window.turnstile);
  }

  render(element: HTMLElement, options: CaptchaRenderOptions): number | string {
    return window.turnstile.render(element, {
      sitekey: options.sitekey,
      callback: options.callback,
      size: "invisible",
      "expired-callback": options["expired-callback"],
      "error-callback": options["error-callback"],
    });
  }

  execute(widgetId?: string): void {
    window.turnstile.execute(widgetId);
  }

  reset(widgetId?: string): void {
    window.turnstile.reset(widgetId);
  }

  getResponse(widgetId?: string): string | null {
    return window.turnstile.getResponse(widgetId);
  }
}
