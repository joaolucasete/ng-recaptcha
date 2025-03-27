import { Component, Inject, Optional, ViewChild } from "@angular/core";
import { CaptchaComponent } from "multi-captcha";

@Component({
  selector: "recaptcha-demo",
  templateUrl: "./invisible-demo.component.html",
})
export class InvisibleDemoComponent {
  @ViewChild("captcha") multiCaptcha: CaptchaComponent;

  public captchaResponse = "";
  // public siteKey: string = "6LdfItkZAAAAAIszILpBAKRqXGKo80WxGNyu2GSs"; // recaptcha
  public siteKey = "8a1c02a8-8938-4392-b62e-424896d8af6e"; // hcaptcha
  // public siteKey = "0x4AAAAAAA_pTcVw10OrUibR"; // turnstile
  isVerifying = false;

  async execute() {
    console.info("Executing invisible reCAPTCHA...", this.multiCaptcha.id);
    const response = await this.multiCaptcha.execute();
    this.resolved(response);
  }

  public async executeAndVerify(): Promise<void> {
    this.isVerifying = true;
    this.captchaResponse += "Iniciando verificação...\n";

    try {
      console.log("Executando captcha...");
      const response = await this.multiCaptcha.execute();
      console.log("Captcha executado com sucesso:", !!response);
      this.resolved(response);
    } catch (error) {
      console.error("Erro ao executar captcha:", error);
      this.onError(error);
    } finally {
      this.isVerifying = false;
    }
  }

  public resolved(captchaResponse: string): void {
    const newResponse = captchaResponse
      ? `${captchaResponse.substring(0, 7)}...${captchaResponse.substring(captchaResponse.length - 7)}`
      : captchaResponse;
    this.captchaResponse += `${JSON.stringify(newResponse)}\n`;
  }

  public onError(errorDetails: any): void {
    this.captchaResponse += `ERROR; error details (if any) have been logged to console\n`;
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
}
