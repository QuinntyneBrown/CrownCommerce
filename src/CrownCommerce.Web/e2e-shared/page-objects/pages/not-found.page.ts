import { type Locator, type Page } from '@playwright/test';

export class NotFoundPagePOM {
  readonly root: Locator;
  readonly code: Locator;
  readonly title: Locator;
  readonly message: Locator;
  readonly homeLink: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-not-found-page');
    this.code = this.root.locator('.not-found__code');
    this.title = this.root.locator('.not-found__title');
    this.message = this.root.locator('.not-found__message');
    this.homeLink = this.root.locator('a, lib-button button');
  }

  async getCodeText(): Promise<string | null> {
    return this.code.textContent();
  }

  async getTitleText(): Promise<string | null> {
    return this.title.textContent();
  }

  async getMessageText(): Promise<string | null> {
    return this.message.textContent();
  }

  async clickHomeLink(): Promise<void> {
    await this.homeLink.first().click();
  }
}
