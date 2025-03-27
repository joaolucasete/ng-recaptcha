import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter } from "rxjs/operators";

import { loader } from "./load-script";
import { CAPTCHA_LOADER_OPTIONS, CaptchaLoaderOptions, CaptchaProvider } from "./tokens";

function toNonNullObservable<T>(subject: BehaviorSubject<T | null>): Observable<T> {
  return subject.asObservable().pipe(filter((value): value is T => value !== null));
}

@Injectable({ providedIn: "root" })
export class CaptchaLoaderService {
  /**
   * @internal
   * @nocollapse
   */
  private static readyMap = new Map<string, BehaviorSubject<CaptchaProvider | null>>();

  /**
   * Returns an Observable that resolves when the captcha provider is ready to use
   * @param provider The captcha provider instance
   */
  public getReady(provider: CaptchaProvider): Observable<CaptchaProvider> {
    const subject = this.initProvider(provider);
    return subject ? toNonNullObservable(subject) : of(provider);
  }

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Optional() @Inject(CAPTCHA_LOADER_OPTIONS) private readonly options?: CaptchaLoaderOptions,
  ) {}

  /** @internal */
  private initProvider(provider: CaptchaProvider): BehaviorSubject<CaptchaProvider | null> | undefined {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }

    const providerName = provider.name;
    if (CaptchaLoaderService.readyMap.has(providerName)) {
      return CaptchaLoaderService.readyMap.get(providerName)!;
    }

    const subject = new BehaviorSubject<CaptchaProvider | null>(null);
    CaptchaLoaderService.readyMap.set(providerName, subject);

    loader.loadScript({
      provider,
      onBeforeLoad: (url) => {
        if (this.options?.onBeforeLoad) {
          return this.options.onBeforeLoad(url);
        }

        return { url };
      },
      onLoaded: (captchaObj) => {
        let value = captchaObj;
        if (this.options?.onLoaded) {
          value = this.options.onLoaded(captchaObj);
        }
        subject.next(provider);
      },
    });

    return subject;
  }
}
