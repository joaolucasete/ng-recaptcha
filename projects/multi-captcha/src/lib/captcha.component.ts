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
} from "@angular/core";
import { Subscription } from "rxjs";
import { CaptchaLoaderService } from "./catpcha-loader.service";
import { CaptchaRenderOptions, ICaptchaProvider } from "./interfaces";

let nextId = 0;

@Component({
  exportAs: "multiCaptcha",
  selector: "multi-captcha",
  template: ``,
})
export class CaptchaComponent implements AfterViewInit, OnDestroy {
  @Input()
  @HostBinding("attr.id")
  public id = `captcha-${nextId++}`;

  @Input() public siteKey: string;
  @Input() public errorMode: "handled" | "default" = "default";

  @Output() public resolved = new EventEmitter<string | null>();
  @Output() public errored = new EventEmitter<any>();

  /** @internal */
  private subscription: Subscription;
  /** @internal */
  private widget: number;
  /** @internal */
  private executeRequested: boolean;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private loader: CaptchaLoaderService,
    private zone: NgZone,
    private provider: ICaptchaProvider,
  ) {}

  public ngAfterViewInit(): void {
    this.loader.getReady(this.provider).subscribe((_) => {
      this.renderRecaptcha();
    });
  }

  public ngOnDestroy(): void {
    // reset the captcha to ensure it does not leave anything behind
    // after the component is no longer needed
    this.grecaptchaReset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Executes the invisible recaptcha.
   * Does nothing if component's size is not set to "invisible".
   */
  public execute(): void {
    if (this.widget != null) {
      this.provider.execute(this.widget);
    } else {
      // delay execution of recaptcha until it actually renders
      this.executeRequested = true;
    }
  }

  public reset(): void {
    if (this.widget != null) {
      if (this.provider.getResponse(this.widget)) {
        // Only emit an event in case if something would actually change.
        // That way we do not trigger "touching" of the control if someone does a "reset"
        // on a non-resolved captcha.
        this.resolved.emit(null);
      }

      this.grecaptchaReset();
    }
  }

  /**
   * ⚠️ Warning! Use this property at your own risk!
   *
   * While this member is `public`, it is not a part of the component's public API.
   * The semantic versioning guarantees _will not be honored_! Thus, you might find that this property behavior changes in incompatible ways in minor or even patch releases.
   * You are **strongly advised** against using this property.
   * Instead, use more idiomatic ways to get reCAPTCHA value, such as `resolved` EventEmitter, or form-bound methods (ngModel, formControl, and the likes).å
   */
  public get __unsafe_widgetValue(): string | null {
    return this.widget != null ? this.provider.getResponse(this.widget) : null;
  }

  /** @internal */
  private onError(args: any) {
    this.errored.emit(args);
  }

  /** @internal */
  private grecaptchaReset() {
    if (this.widget != null) {
      this.zone.runOutsideAngular(() => this.provider.reset(this.widget));
    }
  }

  /** @internal */
  private renderRecaptcha() {
    // This `any` can be removed after @types/grecaptcha get updated
    const renderOptions: CaptchaRenderOptions = {
      sitekey: this.siteKey,
      callback: (response: string) => this.zone.run(() => this.resolved.emit(response)),
      "expired-callback": () => this.zone.run(() => this.resolved.emit(null)),
    };

    if (this.errorMode === "handled") {
      renderOptions["error-callback"] = (...args: any) => {
        this.zone.run(() => this.onError(args));
      };
    }

    this.widget = this.provider.render(this.elementRef.nativeElement, renderOptions);

    if (this.executeRequested === true) {
      this.executeRequested = false;
      this.execute();
    }
  }
}
