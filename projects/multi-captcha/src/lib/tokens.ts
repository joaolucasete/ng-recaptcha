import { InjectionToken } from "@angular/core";
import { ICaptchaProvider } from "./interfaces";

export enum CaptchaProvider {
  Recaptcha = "Recaptcha",
  Hcaptcha = "Hcaptcha",
  Turnstile = "Turnstile",
}

export interface CaptchaLoaderOptions {
  onBeforeLoad?(url: URL): { url: URL; nonce?: string };
  onLoaded?(captchaObj: unknown): unknown;
}

export const CAPTCHA_LOADER_OPTIONS = new InjectionToken<CaptchaLoaderOptions>("CAPTCHA_LOADER_OPTIONS");
export const CAPTCHA_PROVIDER = new InjectionToken<ICaptchaProvider>("CAPTCHA_PROVIDER");
export const SELECTED_CAPTCHA_PROVIDER = new InjectionToken<CaptchaProvider>("SELECTED_CAPTCHA_PROVIDER");
