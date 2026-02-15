import { type Locator, type Page } from '@playwright/test';

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId?: string;
}

export class InquiryFormPOM {
  readonly root: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageInput: Locator;
  readonly productSelect: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, parentLocator?: Locator) {
    const scope = parentLocator ?? page.locator('body');
    this.root = scope.locator('feat-inquiry-form');
    this.nameInput = this.root.locator('.inquiry-form__input[name="name"], input[name="name"]');
    this.emailInput = this.root.locator('.inquiry-form__input[name="email"], input[name="email"]');
    this.phoneInput = this.root.locator('.inquiry-form__input[name="phone"], input[name="phone"]');
    this.messageInput = this.root.locator('.inquiry-form__textarea, textarea[name="message"]');
    this.productSelect = this.root.locator('.inquiry-form__select, select[name="productId"]');
    this.submitButton = this.root.locator('lib-button button');
    this.successMessage = this.root.locator('.inquiry-form__success');
    this.errorMessage = this.root.locator('.inquiry-form__error');
  }

  async fillAndSubmit(data: InquiryFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.messageInput.fill(data.message);
    if (data.productId) await this.productSelect.selectOption(data.productId);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successMessage.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
