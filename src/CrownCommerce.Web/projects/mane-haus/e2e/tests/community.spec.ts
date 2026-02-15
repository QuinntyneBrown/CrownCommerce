import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Community Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the community section', async () => {
    await expect(homePage.community.root).toBeVisible();
  });

  test('should display the section label', async () => {
    const label = await homePage.community.getLabelText();
    expect(label?.trim()).toBe('JOIN THE HAUS');
  });

  test('should display the section heading', async () => {
    const heading = await homePage.community.getHeadingText();
    expect(heading?.trim()).toBe('Follow the Journey');
  });

  test('should display the social handle', async () => {
    const handle = await homePage.community.getHandleText();
    expect(handle?.trim()).toBe('@ManeHaus');
  });

  test('should display gallery photos after loading', async () => {
    await homePage.community.photoItems.first().waitFor({ state: 'visible' });
    const count = await homePage.community.getPhotoCount();
    expect(count).toBe(4);
  });
});
