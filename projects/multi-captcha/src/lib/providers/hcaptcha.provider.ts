import { Injectable } from "@angular/core";
import { CaptchaProvider, CaptchaProviderType, CaptchaRenderOptions } from "../tokens";

declare global {
  interface Window {
    hcaptcha: any;
  }
}

@Injectable({
  providedIn: "root",
})
export class HcaptchaProvider implements CaptchaProvider {
  readonly name = CaptchaProviderType.Hcaptcha;
  url = "https://js.hcaptcha.com/1/api.js";

  callbackHandler(onLoaded: Function) {
    return () => onLoaded(window.hcaptcha);
  }

  render(element: HTMLElement, options: CaptchaRenderOptions): number {
    const renderOptions = {
      sitekey: options.sitekey,
      callback: options.callback,
      size: "invisible",
      "expired-callback": options["expired-callback"],
      "error-callback": options["error-callback"],
    };

    return window.hcaptcha.render(element, renderOptions);
  }

  execute(widgetId?: number): void {
    window.hcaptcha.execute(widgetId);
  }

  reset(widgetId?: number): void {
    window.hcaptcha.reset(widgetId);
  }

  getResponse(widgetId?: number): string | null {
    return window.hcaptcha.getResponse(widgetId);
  }
}
