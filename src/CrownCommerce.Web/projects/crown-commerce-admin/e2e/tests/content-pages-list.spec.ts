import { test, expect } from '@playwright/test';
import { ContentPagesListPage } from '../page-objects/pages/content-pages-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockContentPages } from '../fixtures/mock-data';

test.describe('Content Pages List', () => {
  let contentPagesPage: ContentPagesListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    contentPagesPage = new ContentPagesListPage(page);
    await contentPagesPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Content Pages"', async () => {
      await expect(contentPagesPage.pageTitle).toHaveText('Content Pages');
    });

    test('should display page subtitle', async () => {
      await expect(contentPagesPage.pageSubtitle).toHaveText('Manage website content pages');
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(contentPagesPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(contentPagesPage.searchField).toHaveAttribute('placeholder', 'Search pages...');
    });

    test('should filter pages by search term', async () => {
      await contentPagesPage.searchField.fill('about');
      await expect(contentPagesPage.dataTable.rows.first()).toContainText('About Us');
    });
  });

  test.describe('Table Data', () => {
    test('should display content pages table', async () => {
      await expect(contentPagesPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await contentPagesPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Title');
      expect(trimmed).toContain('Slug');
      expect(trimmed).toContain('Created');
      expect(trimmed).toContain('Actions');
    });

    test('should display page rows', async () => {
      const count = await contentPagesPage.dataTable.getRowCount();
      expect(count).toBe(mockContentPages.length);
    });

    test('should display first page title', async () => {
      const title = await contentPagesPage.dataTable.getCellText(0, 0);
      expect(title).toBe(mockContentPages[0].title);
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = contentPagesPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete Page');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = contentPagesPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
