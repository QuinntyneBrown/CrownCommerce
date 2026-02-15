import { type Locator, type Page } from '@playwright/test';

export class ContentPagePOM {
  readonly root: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly loadingState: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-content-page');
    this.title = this.root.locator('.content-page__title');
    this.body = this.root.locator('.content-page__body');
    this.loadingState = this.root.locator('.content-page__loading');
    this.errorState = this.root.locator('.content-page__error');
  }

  async goto(slug: string): Promise<void> {
    await this.page.goto(`/${slug}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitleText(): Promise<string | null> {
    return this.title.textContent();
  }

  async getBodyText(): Promise<string | null> {
    return this.body.textContent();
  }

  async isLoading(): Promise<boolean> {
    return this.loadingState.isVisible();
  }

  async hasError(): Promise<boolean> {
    return this.errorState.isVisible();
  }
}
