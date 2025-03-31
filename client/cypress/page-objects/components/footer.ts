// cypress/page-objects/components/footer.ts
import { BasePage } from '../base-page';

export class Footer extends BasePage {
  // Selectors
  copyrightText = '.text-center.text-base.text-gray-400';

  // Assertions
  shouldShowCopyright(year: string) {
    this.shouldContainText(this.copyrightText, `© ${year} HealthCommerce, Inc.`);
    return this;
  }
}