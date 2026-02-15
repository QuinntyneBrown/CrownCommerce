import { type Locator, type Page } from '@playwright/test';
import { InquiryFormPOM } from '../components/inquiry-form.component';

export class ContactPagePOM {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly inquiryForm: InquiryFormPOM;

  constructor(private page: Page) {
    this.root = page.locator('feat-contact-page');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.inquiryForm = new InquiryFormPOM(page, this.root);
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
