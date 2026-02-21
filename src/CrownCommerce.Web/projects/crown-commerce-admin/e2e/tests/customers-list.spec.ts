import { test, expect } from '@playwright/test';
import { CustomersListPage } from '../page-objects/pages/customers-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockCustomers } from '../fixtures/mock-data';

test.describe('Customers List', () => {
  let customersPage: CustomersListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    customersPage = new CustomersListPage(page);
    await customersPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Customer Management"', async () => {
      await expect(customersPage.pageTitle).toHaveText('Customer Management');
    });

    test('should display page subtitle', async () => {
      await expect(customersPage.pageSubtitle).toHaveText('Manage your customer relationships');
    });
  });

  test.describe('Stats Cards', () => {
    test('should display 4 stat cards', async () => {
      const count = await customersPage.statCards.count();
      expect(count).toBe(4);
    });

    test('should display Total Customers stat', async () => {
      const card = customersPage.statCards.filter({ hasText: 'Total Customers' });
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-value')).toHaveText(String(mockCustomers.length));
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(customersPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(customersPage.searchField).toHaveAttribute('placeholder', 'Search customers...');
    });

    test('should filter customers by search term', async () => {
      await customersPage.searchField.fill('keisha');
      await expect(customersPage.dataTable.rows.first()).toContainText('Keisha Brown');
    });
  });

  test.describe('Table Data', () => {
    test('should display customers table', async () => {
      await expect(customersPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await customersPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Name');
      expect(trimmed).toContain('Email');
      expect(trimmed).toContain('Status');
      expect(trimmed).toContain('Tier');
      expect(trimmed).toContain('Orders');
      expect(trimmed).toContain('Actions');
    });

    test('should display customer rows', async () => {
      const count = await customersPage.dataTable.getRowCount();
      expect(count).toBe(mockCustomers.length);
    });

    test('should display first customer name', async () => {
      const name = await customersPage.dataTable.getCellText(0, 0);
      expect(name).toBe(mockCustomers[0].name);
    });

    test('should display status chips', async () => {
      const chip = customersPage.getStatusChip(0);
      await expect(chip.first()).toBeVisible();
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = customersPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete Customer');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = customersPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
