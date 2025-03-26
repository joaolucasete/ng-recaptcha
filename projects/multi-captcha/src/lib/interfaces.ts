export abstract class ICaptchaProvider {
  readonly name: string;
  url: string;
  abstract callbackHandler(onLoaded: Function): () => void;
  abstract render(element: HTMLElement, options: CaptchaRenderOptions): number;
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
