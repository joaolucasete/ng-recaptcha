import { CaptchaProvider } from "./tokens";

declare global {
  interface Window {
    captchaloaded?: () => void;
  }
}

function loadScript({
  provider,
  onBeforeLoad,
  onLoaded,
}: {
  provider: CaptchaProvider;
  onBeforeLoad(url: URL): { url: URL; nonce?: string };
  onLoaded(captchaObj: any): void;
}) {
  window.captchaloaded = provider.callbackHandler(onLoaded);
  const script = document.createElement("script");
  script.innerHTML = "";

  const { url: scriptUrl, nonce } = onBeforeLoad(new URL(provider.url));

  scriptUrl.searchParams.set("onload", "captchaloaded");
  scriptUrl.searchParams.set("render", "explicit");

  script.src = scriptUrl.href;
  if (nonce) {
    script.setAttribute("nonce", nonce);
  }
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export const loader = { loadScript };
