import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  Output,
  signal,
} from "@angular/core";
import { CaptchaLoaderService } from "./catpcha-loader.service";
import { CaptchaRenderOptions, ICaptchaProvider } from "./interfaces";

@Component({
  exportAs: "multiCaptcha",
  selector: "multi-captcha",
  template: ``,
})
export class CaptchaComponent implements AfterViewInit, OnDestroy {
  @HostBinding("attr.id")
  id = `captcha-${Math.floor(100000 + Math.random() * 900000)}`;

  @Input() public siteKey: string;
  @Input() public errorMode: "handled" | "default" = "default";

  @Output() public resolved = new EventEmitter<string | null>();
  @Output() public errored = new EventEmitter<any>();

  providerName = signal<string | null>(null);

  private pendingPromiseResolvers: {
    resolve: (value: string) => void;
    reject: (reason: any) => void;
  }[] = [];

  /** @internal */
  private widgetId: number;
  /** @internal */
  private executeRequested: boolean;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private loader: CaptchaLoaderService,
    private zone: NgZone,
    private provider: ICaptchaProvider,
  ) {}

  public ngAfterViewInit(): void {
    this.loader.getReady(this.provider).subscribe(() => {
      this.renderRecaptcha();
      this.providerName.set(this.provider.name);
    });
  }

  public ngOnDestroy(): void {
    // reset the captcha to ensure it does not leave anything behind
    // after the component is no longer needed
    this.grecaptchaReset();
  }

  /**
   * Executes the invisible recaptcha.
   * Does nothing if component's size is not set to "invisible".
   */
  public execute(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.widgetId) {
        if (this.pendingPromiseResolvers.length) {
          const pendingError = new Error("Nova execução iniciada antes da conclusão da anterior");
          this.pendingPromiseResolvers.forEach((resolver) => resolver.reject(pendingError));
          this.pendingPromiseResolvers = [];
        }

        this.pendingPromiseResolvers.push({ resolve, reject });
        this.provider.execute(this.widgetId);
      } else {
        this.pendingPromiseResolvers.push({ resolve, reject });
        this.executeRequested = true;
      }
    });
  }

  public reset(): void {
    if (this.widgetId) {
      if (this.provider.getResponse(this.widgetId)) {
        // Only emit an event in case if something would actually change.
        // That way we do not trigger "touching" of the control if someone does a "reset"
        // on a non-resolved captcha.
        this.resolved.emit(null);
      }

      this.grecaptchaReset();
    }
  }

  /** @internal */
  private onError(args: any) {
    this.errored.emit(args);
  }

  /** @internal */
  private grecaptchaReset() {
    if (this.widgetId != null) {
      this.zone.runOutsideAngular(() => this.tryCatch(() => this.provider.reset(this.widgetId)));
    }
  }

  /** @internal */
  private renderRecaptcha() {
    // This `any` can be removed after @types/grecaptcha get updated
    const renderOptions: CaptchaRenderOptions = {
      sitekey: this.siteKey,
      callback: (response: string) => this.zone.run(() => this.captchaResponseCallback(response)),
      "expired-callback": () => this.zone.run(() => this.resolved.emit(null)),
    };

    if (this.errorMode === "handled") {
      renderOptions["error-callback"] = (...args: any) => {
        this.zone.run(() => this.onError(args));
      };
    }

    this.widgetId = this.tryCatch(() => this.provider.render(this.elementRef.nativeElement, renderOptions));

    if (this.executeRequested === true) {
      this.executeRequested = false;
      this.execute();
    }
  }

  private captchaResponseCallback(response: string) {
    this.resolved.emit(response);

    this.pendingPromiseResolvers.forEach((resolver) => resolver.resolve(response));
    this.pendingPromiseResolvers = [];
  }

  private tryCatch(fn: Function) {
    try {
      return fn();
    } catch (e) {
      this.onError(e);
    }
  }
}
