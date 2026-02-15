import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/pages/home.page';
import { setupApiMocks } from '../fixtures/api-mocks';

test.describe('Brand Story Section', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display the brand story section', async () => {
    await expect(homePage.brandStory.root).toBeVisible();
  });

  test('should have the #story anchor id', async ({ page }) => {
    const section = page.locator('section.brand-story');
    await expect(section).toHaveAttribute('id', 'story');
  });

  test('should display the section label', async () => {
    const label = await homePage.brandStory.getLabelText();
    expect(label?.trim()).toBe('OUR STORY');
  });

  test('should display the section heading', async () => {
    const heading = await homePage.brandStory.getHeadingText();
    expect(heading?.trim()).toBe('Where Luxury Meets Intention');
  });

  test('should display the accent divider', async () => {
    await expect(homePage.brandStory.divider).toBeVisible();
  });

  test('should display the body text', async () => {
    const body = await homePage.brandStory.getBodyText();
    expect(body).toContain('Mane Haus was created for the woman who refuses to compromise');
    expect(body).toContain('Toronto');
  });

  test('should display the emphasis text', async () => {
    const emphasis = await homePage.brandStory.getEmphasisText();
    expect(emphasis?.trim()).toBe("This isn't just hair. It's your signature.");
  });
});
