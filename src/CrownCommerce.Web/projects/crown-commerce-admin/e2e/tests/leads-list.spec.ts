import { test, expect } from '@playwright/test';
import { LeadsListPage } from '../page-objects/pages/leads-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockLeads } from '../fixtures/mock-data';

test.describe('Leads List', () => {
  let leadsPage: LeadsListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    leadsPage = new LeadsListPage(page);
    await leadsPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Lead Management"', async () => {
      await expect(leadsPage.pageTitle).toHaveText('Lead Management');
    });

    test('should display page subtitle', async () => {
      await expect(leadsPage.pageSubtitle).toHaveText('Track and manage sales leads');
    });
  });

  test.describe('Stats Cards', () => {
    test('should display 4 stat cards', async () => {
      const count = await leadsPage.statCards.count();
      expect(count).toBe(4);
    });

    test('should display Total Leads stat', async () => {
      const card = leadsPage.statCards.filter({ hasText: 'Total Leads' });
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-value')).toHaveText(String(mockLeads.length));
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(leadsPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(leadsPage.searchField).toHaveAttribute('placeholder', 'Search leads...');
    });

    test('should filter leads by search term', async () => {
      await leadsPage.searchField.fill('sarah');
      await expect(leadsPage.dataTable.rows.first()).toContainText('Sarah Robinson');
    });
  });

  test.describe('Table Data', () => {
    test('should display leads table', async () => {
      await expect(leadsPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await leadsPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Name');
      expect(trimmed).toContain('Company');
      expect(trimmed).toContain('Source');
      expect(trimmed).toContain('Status');
      expect(trimmed).toContain('Est. Revenue');
      expect(trimmed).toContain('Actions');
    });

    test('should display lead rows', async () => {
      const count = await leadsPage.dataTable.getRowCount();
      expect(count).toBe(mockLeads.length);
    });

    test('should display first lead name', async () => {
      const name = await leadsPage.dataTable.getCellText(0, 0);
      expect(name).toBe(mockLeads[0].name);
    });

    test('should display status chips', async () => {
      const chip = leadsPage.getStatusChip(0);
      await expect(chip.first()).toBeVisible();
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = leadsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete Lead');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = leadsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
