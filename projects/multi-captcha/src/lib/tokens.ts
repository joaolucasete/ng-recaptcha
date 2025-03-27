import { InjectionToken } from "@angular/core";

export abstract class CaptchaProvider {
  readonly name: string;
  url: string;
  abstract callbackHandler(onLoaded: Function): () => void;
  abstract render(element: HTMLElement, options: CaptchaRenderOptions): number | string;
  abstract execute(widgetId?: string | number): void;
  abstract reset(widgetId?: string | number): void;
  abstract getResponse(widgetId?: string | number): string | null;
}

export interface CaptchaRenderOptions {
  sitekey: string;
  callback(response: string): void;
  "expired-callback"?(): void;
  "error-callback"?(): void;
}

export enum CaptchaProviderType {
  Recaptcha = "Recaptcha",
  Hcaptcha = "Hcaptcha",
  Turnstile = "Turnstile",
}

export interface CaptchaLoaderOptions {
  onBeforeLoad?(url: URL): { url: URL; nonce?: string };
  onLoaded?(captchaObj: CaptchaProvider): CaptchaProvider;
}

export interface CaptchaSettings {
  siteKey: string;
  provider: CaptchaProviderType;
}

export const CAPTCHA_LOADER_OPTIONS = new InjectionToken<CaptchaLoaderOptions>("CAPTCHA_LOADER_OPTIONS");
export const CAPTCHA_SETTINGS = new InjectionToken<CaptchaSettings>("CAPTCHA_SETTINGS");
