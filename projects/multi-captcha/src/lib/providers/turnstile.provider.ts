import { Injectable } from "@angular/core";
import { CaptchaRenderOptions, ICaptchaProvider } from "../interfaces";
import { CaptchaProvider } from "../tokens";

@Injectable({
  providedIn: "root",
})
export class TurnstileProvider implements ICaptchaProvider {
  readonly name = CaptchaProvider.Turnstile;
  url = "https://challenges.cloudflare.com/turnstile/v0/api.js";

  callbackHandler(onLoaded: Function) {
    return () => onLoaded(window.turnstile);
  }

  render(element: HTMLElement, options: CaptchaRenderOptions): number {
    return window.turnstile.render(element, {
      sitekey: options.sitekey,
      callback: options.callback,
      size: "invisible",
      "expired-callback": options["expired-callback"],
      "error-callback": options["error-callback"],
    });
  }

  execute(widgetId?: number): void {
    window.turnstile.execute(widgetId);
  }

  reset(widgetId?: number): void {
    window.turnstile.reset(widgetId);
  }

  getResponse(widgetId?: number): string | null {
    return window.turnstile.getResponse(widgetId);
  }
}
