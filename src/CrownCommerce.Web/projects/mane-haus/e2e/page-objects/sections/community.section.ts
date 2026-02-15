import { type Locator, type Page } from '@playwright/test';

export class CommunitySection {
  readonly root: Locator;
  readonly sectionHeader: Locator;
  readonly label: Locator;
  readonly heading: Locator;
  readonly handle: Locator;
  readonly photos: Locator;
  readonly photoItems: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.community');
    this.sectionHeader = this.root.locator('lib-section-header');
    this.label = this.sectionHeader.locator('.section-header__label');
    this.heading = this.sectionHeader.locator('.section-header__heading');
    this.handle = this.root.locator('.community__handle');
    this.photos = this.root.locator('.community__photos');
    this.photoItems = this.photos.locator('.community__photo');
    this.loadingSpinner = this.photos.locator('app-loading-spinner');
    this.errorState = this.photos.locator('app-error-state');
  }

  async getPhotoCount(): Promise<number> {
    return this.photoItems.count();
  }

  async getLabelText(): Promise<string | null> {
    return this.label.textContent();
  }

  async getHeadingText(): Promise<string | null> {
    return this.heading.textContent();
  }

  async getHandleText(): Promise<string | null> {
    return this.handle.textContent();
  }
}
