import { test, expect } from '@playwright/test';
import { CampaignsListPage } from '../page-objects/pages/campaigns-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockCampaigns } from '../fixtures/mock-data';

test.describe('Campaigns List', () => {
  let campaignsPage: CampaignsListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    campaignsPage = new CampaignsListPage(page);
    await campaignsPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Newsletter Campaigns"', async () => {
      await expect(campaignsPage.pageTitle).toHaveText('Newsletter Campaigns');
    });

    test('should display page subtitle', async () => {
      await expect(campaignsPage.pageSubtitle).toHaveText('Create and manage email campaigns');
    });
  });

  test.describe('Stats Cards', () => {
    test('should display 4 stat cards', async () => {
      const count = await campaignsPage.statCards.count();
      expect(count).toBe(4);
    });

    test('should display Total Campaigns stat', async () => {
      const card = campaignsPage.statCards.filter({ hasText: 'Total Campaigns' });
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-value')).toHaveText(String(mockCampaigns.length));
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(campaignsPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(campaignsPage.searchField).toHaveAttribute('placeholder', 'Search campaigns...');
    });

    test('should filter campaigns by search term', async () => {
      await campaignsPage.searchField.fill('spring');
      await expect(campaignsPage.dataTable.rows.first()).toContainText('Spring Sale Launch');
    });
  });

  test.describe('Table Data', () => {
    test('should display campaigns table', async () => {
      await expect(campaignsPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await campaignsPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Subject');
      expect(trimmed).toContain('Status');
      expect(trimmed).toContain('Recipients');
      expect(trimmed).toContain('Sent');
      expect(trimmed).toContain('Opened');
      expect(trimmed).toContain('Scheduled');
      expect(trimmed).toContain('Actions');
    });

    test('should display campaign rows', async () => {
      const count = await campaignsPage.dataTable.getRowCount();
      expect(count).toBe(mockCampaigns.length);
    });

    test('should display first campaign subject', async () => {
      const subject = await campaignsPage.dataTable.getCellText(0, 0);
      expect(subject).toBe(mockCampaigns[0].subject);
    });

    test('should display status chips', async () => {
      const chip = campaignsPage.getStatusChip(0);
      await expect(chip.first()).toBeVisible();
    });
  });

  test.describe('Pagination', () => {
    test('should display paginator text', async () => {
      const text = await campaignsPage.pagination.getPaginatorText();
      expect(text).toContain('Showing');
    });

    test('should have Previous button disabled on first page', async () => {
      const disabled = await campaignsPage.pagination.isPreviousDisabled();
      expect(disabled).toBe(true);
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = campaignsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete Campaign');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = campaignsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
