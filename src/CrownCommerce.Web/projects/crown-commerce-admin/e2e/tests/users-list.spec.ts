import { test, expect } from '@playwright/test';
import { UsersListPage } from '../page-objects/pages/users-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockAdminUsers } from '../fixtures/mock-data';

test.describe('Users List', () => {
  let usersPage: UsersListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    usersPage = new UsersListPage(page);
    await usersPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "User Management"', async () => {
      await expect(usersPage.pageTitle).toHaveText('User Management');
    });

    test('should display page subtitle', async () => {
      await expect(usersPage.pageSubtitle).toHaveText('Manage admin users and roles');
    });
  });

  test.describe('Stats Cards', () => {
    test('should display 3 stat cards', async () => {
      const count = await usersPage.statCards.count();
      expect(count).toBe(3);
    });

    test('should display Total Users stat', async () => {
      const card = usersPage.statCards.filter({ hasText: 'Total Users' });
      await expect(card).toBeVisible();
      await expect(card.locator('.stat-value')).toHaveText(String(mockAdminUsers.length));
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(usersPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(usersPage.searchField).toHaveAttribute('placeholder', 'Search users...');
    });

    test('should filter users by search term', async () => {
      await usersPage.searchField.fill('quinn');
      await expect(usersPage.dataTable.rows.first()).toContainText('quinn@crowncommerce.com');
    });
  });

  test.describe('Table Data', () => {
    test('should display users table', async () => {
      await expect(usersPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await usersPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Name');
      expect(trimmed).toContain('Email');
      expect(trimmed).toContain('Role');
      expect(trimmed).toContain('Created');
      expect(trimmed).toContain('Actions');
    });

    test('should display user rows', async () => {
      const count = await usersPage.dataTable.getRowCount();
      expect(count).toBe(mockAdminUsers.length);
    });

    test('should display first user name', async () => {
      const name = await usersPage.dataTable.getCellText(0, 0);
      expect(name).toContain(mockAdminUsers[0].firstName);
    });

    test('should display role chips', async () => {
      const chip = usersPage.getRoleChip(0);
      await expect(chip.first()).toBeVisible();
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = usersPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete User');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = usersPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
