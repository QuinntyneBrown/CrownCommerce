import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';

test.describe('Community Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the community section', async () => {
    await expect(homePage.community.root).toBeVisible();
  });

  test('should display the section label', async () => {
    const label = await homePage.community.getLabelText();
    expect(label?.trim()).toBe('JOIN THE COLLECTIVE');
  });

  test('should display the section heading', async () => {
    const heading = await homePage.community.getHeadingText();
    expect(heading?.trim()).toBe('Follow the Journey');
  });

  test('should display the Instagram handle', async () => {
    const handle = await homePage.community.getHandleText();
    expect(handle?.trim()).toBe('@OriginHairCollective');
  });

  test('should display exactly 8 community photos', async () => {
    await homePage.community.photos.first().waitFor({ state: 'visible' });
    const count = await homePage.community.getPhotoCount();
    expect(count).toBe(8);
  });

  test('should have background images on all photos', async () => {
    await homePage.community.photos.first().waitFor({ state: 'visible' });
    const count = await homePage.community.getPhotoCount();
    for (let i = 0; i < count; i++) {
      const hasImage = await homePage.community.photoHasBackgroundImage(i);
      expect(hasImage).toBe(true);
    }
  });
});
