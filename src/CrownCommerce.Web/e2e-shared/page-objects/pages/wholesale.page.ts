import { type Locator, type Page } from '@playwright/test';
import { InquiryFormPOM } from '../components/inquiry-form.component';

export class WholesalePagePOM {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly intro: Locator;
  readonly inquiryForm: InquiryFormPOM;

  constructor(private page: Page) {
    this.root = page.locator('feat-wholesale-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.intro = this.root.locator('.wholesale-page__intro');
    this.inquiryForm = new InquiryFormPOM(page, this.root);
  }

  async goto(): Promise<void> {
    await this.page.goto('/wholesale');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getIntroText(): Promise<string | null> {
    return this.intro.textContent();
  }
}
