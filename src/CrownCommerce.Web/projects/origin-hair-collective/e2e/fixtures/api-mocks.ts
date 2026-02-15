import { Page } from '@playwright/test';
import { setupFeatureApiMocks } from '../../../../e2e-shared/fixtures';

/**
 * Sets up all API route mocks for the Origin Hair Collective application.
 * Extends shared feature mocks with OHC-specific routes.
 */
export async function setupApiMocks(page: Page): Promise<void> {
  await setupFeatureApiMocks(page);
  // OHC-specific route overrides can be added here
}
