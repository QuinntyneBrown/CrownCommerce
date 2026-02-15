import { type Locator, type Page } from '@playwright/test';

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
}

export class CheckoutPagePOM {
  readonly root: Locator;
  readonly title: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly submitButton: Locator;
  readonly successState: Locator;
  readonly errorMessage: Locator;
  readonly paymentNotice: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-checkout-page');
    this.title = this.root.locator('.checkout__title');
    this.form = this.root.locator('.checkout__form');
    this.nameInput = this.form.locator('.checkout__input[name="customerName"], input[name="customerName"]');
    this.emailInput = this.form.locator('.checkout__input[name="customerEmail"], input[name="customerEmail"]');
    this.addressInput = this.form.locator('.checkout__textarea[name="shippingAddress"], textarea[name="shippingAddress"], .checkout__input[name="shippingAddress"]');
    this.submitButton = this.form.locator('lib-button button');
    this.successState = this.root.locator('.checkout__success');
    this.errorMessage = this.root.locator('.checkout__error');
    this.paymentNotice = this.root.locator('.checkout__payment-notice');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillAndSubmit(data: CheckoutFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.submitButton.click();
  }

  async isSuccess(): Promise<boolean> {
    return this.successState.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
