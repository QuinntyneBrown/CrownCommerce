import { type Locator, type Page } from '@playwright/test';
import { InquiryFormPOM } from '../components/inquiry-form.component';

export class AmbassadorPagePOM {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly body: Locator;
  readonly inquiryForm: InquiryFormPOM;

  constructor(private page: Page) {
    this.root = page.locator('feat-ambassador-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.body = this.root.locator('.ambassador-page__body');
    this.inquiryForm = new InquiryFormPOM(page, this.root);
  }

  async goto(): Promise<void> {
    await this.page.goto('/ambassador');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getBodyText(): Promise<string | null> {
    return this.body.textContent();
  }
}
