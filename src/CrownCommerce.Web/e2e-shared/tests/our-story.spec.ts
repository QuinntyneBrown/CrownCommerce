import { test, expect } from '@playwright/test';
import { OurStoryPagePOM } from '../page-objects/pages/our-story.page';
import { setupFeatureApiMocks } from '../fixtures';
import { mockBrandStory } from '../fixtures/mock-data';

test.describe('OurStoryPage (feat-our-story-page)', () => {
  test.beforeEach(async ({ page }) => {
    await setupFeatureApiMocks(page);
  });

  test('renders hero section with title', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.root).toBeVisible();
    await expect(story.heroTitle).toContainText(mockBrandStory.heroTitle);
    await expect(story.heroLabel).toContainText('OUR STORY');
  });

  test('displays hero image', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.heroImage).toBeVisible();
  });

  test('displays founder section', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.founderSection).toBeVisible();
    await expect(story.founderImage).toBeVisible();
    await expect(story.founderName).toContainText(mockBrandStory.founder.name);
  });

  test('displays mission section', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.missionSection).toBeVisible();
    await expect(story.missionTitle).toContainText(mockBrandStory.mission.title);
  });

  test('displays values grid', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.valuesGrid).toBeVisible();
    expect(await story.getValueCardCount()).toBe(mockBrandStory.values.length);
  });

  test('displays timeline grid', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.timelineGrid).toBeVisible();
    expect(await story.getTimelineCardCount()).toBe(mockBrandStory.timeline.length);
  });

  test('displays CTA section with shop button', async ({ page }) => {
    const story = new OurStoryPagePOM(page);
    await story.goto();
    await expect(story.ctaSection).toBeVisible();
    await expect(story.ctaButton).toBeVisible();
  });
});
