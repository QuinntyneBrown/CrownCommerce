import { test, expect } from '@playwright/test';
import { GalleryListPage } from '../page-objects/pages/gallery-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockGalleryImages } from '../fixtures/mock-data';

test.describe('Gallery List', () => {
  let galleryPage: GalleryListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    galleryPage = new GalleryListPage(page);
    await galleryPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "Gallery Management"', async () => {
      await expect(galleryPage.pageTitle).toHaveText('Gallery Management');
    });

    test('should display page subtitle', async () => {
      await expect(galleryPage.pageSubtitle).toHaveText('Manage gallery images and categories');
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(galleryPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(galleryPage.searchField).toHaveAttribute('placeholder', 'Search images...');
    });

    test('should filter images by search term', async () => {
      await galleryPage.searchField.fill('cambodian');
      await expect(galleryPage.dataTable.rows.first()).toContainText('Cambodian Straight Bundle');
    });
  });

  test.describe('Table Data', () => {
    test('should display gallery table', async () => {
      await expect(galleryPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await galleryPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Title');
      expect(trimmed).toContain('Category');
      expect(trimmed).toContain('Image URL');
      expect(trimmed).toContain('Created');
      expect(trimmed).toContain('Actions');
    });

    test('should display image rows', async () => {
      const count = await galleryPage.dataTable.getRowCount();
      expect(count).toBe(mockGalleryImages.length);
    });

    test('should display first image title', async () => {
      const title = await galleryPage.dataTable.getCellText(0, 0);
      expect(title).toBe(mockGalleryImages[0].title);
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = galleryPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete Image');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = galleryPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
