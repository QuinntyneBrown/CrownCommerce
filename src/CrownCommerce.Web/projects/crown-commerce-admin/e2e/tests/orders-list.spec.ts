import { test, expect } from '@playwright/test';
import { OrdersListPage } from '../page-objects/pages/orders-list.page';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockOrders } from '../fixtures/mock-data';

test.describe('Orders List', () => {
  let ordersPage: OrdersListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    ordersPage = new OrdersListPage(page);
    await ordersPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Order Management"', async () => {
      await expect(ordersPage.pageTitle).toHaveText('Order Management');
    });

    test('should display page subtitle', async () => {
      await expect(ordersPage.pageSubtitle).toHaveText('View and manage customer orders');
    });
  });

  test.describe('Stats Cards', () => {
    test('should display 5 stat cards', async () => {
      const count = await ordersPage.statCards.count();
      expect(count).toBe(5);
    });

    test('should display Total Orders stat', async () => {
      const card = ordersPage.statCards.filter({ hasText: 'Total Orders' });
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-value')).toHaveText(String(mockOrders.length));
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(ordersPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(ordersPage.searchField).toHaveAttribute('placeholder', 'Search orders...');
    });

    test('should filter orders by search term', async () => {
      await ordersPage.searchField.fill('keisha');
      await expect(ordersPage.dataTable.rows.first()).toContainText('Keisha Brown');
    });
  });

  test.describe('Table Data', () => {
    test('should display orders table', async () => {
      await expect(ordersPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await ordersPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Order ID');
      expect(trimmed).toContain('Customer');
      expect(trimmed).toContain('Email');
      expect(trimmed).toContain('Total');
      expect(trimmed).toContain('Status');
      expect(trimmed).toContain('Date');
      expect(trimmed).toContain('Actions');
    });

    test('should display order rows', async () => {
      const count = await ordersPage.dataTable.getRowCount();
      expect(count).toBe(mockOrders.length);
    });

    test('should display first order ID', async () => {
      const id = await ordersPage.dataTable.getCellText(0, 0);
      expect(id).toBe(mockOrders[0].id);
    });

    test('should display status chips', async () => {
      const chip = ordersPage.getStatusChip(0);
      await expect(chip.first()).toBeVisible();
    });
  });
});
