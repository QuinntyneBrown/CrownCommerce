import { test, expect } from '@playwright/test';
import { FaqsListPage } from '../page-objects/pages/faqs-list.page';
import { ConfirmDialogComponent } from '../page-objects/components/confirm-dialog.component';
import { setupApiMocks } from '../fixtures/api-mocks';
import { mockFaqs } from '../fixtures/mock-data';

test.describe('FAQs List', () => {
  let faqsPage: FaqsListPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    faqsPage = new FaqsListPage(page);
    await faqsPage.goto();
  });

  test.describe('Page Header', () => {
    test('should display page title "FAQ Management"', async () => {
      await expect(faqsPage.pageTitle).toHaveText('FAQ Management');
    });

    test('should display page subtitle', async () => {
      await expect(faqsPage.pageSubtitle).toHaveText('Manage frequently asked questions');
    });
  });

  test.describe('Search', () => {
    test('should display search field', async () => {
      await expect(faqsPage.searchField).toBeVisible();
    });

    test('should have search placeholder text', async () => {
      await expect(faqsPage.searchField).toHaveAttribute('placeholder', 'Search FAQs...');
    });

    test('should filter FAQs by search term', async () => {
      await faqsPage.searchField.fill('shipping');
      await expect(faqsPage.dataTable.rows.first()).toContainText('How long does shipping take?');
    });
  });

  test.describe('Table Data', () => {
    test('should display FAQs table', async () => {
      await expect(faqsPage.dataTable.table).toBeVisible();
    });

    test('should display correct header columns', async () => {
      const headers = await faqsPage.dataTable.getHeaderTexts();
      const trimmed = headers.map((h) => h.trim());
      expect(trimmed).toContain('Question');
      expect(trimmed).toContain('Answer');
      expect(trimmed).toContain('Category');
      expect(trimmed).toContain('Actions');
    });

    test('should display FAQ rows', async () => {
      const count = await faqsPage.dataTable.getRowCount();
      expect(count).toBe(mockFaqs.length);
    });

    test('should display first FAQ question', async () => {
      const question = await faqsPage.dataTable.getCellText(0, 0);
      expect(question).toBe(mockFaqs[0].question);
    });
  });

  test.describe('Delete', () => {
    test('should open confirmation dialog when clicking delete', async ({ page }) => {
      const deleteBtn = faqsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await expect(dialog.title).toHaveText('Delete FAQ');
      await expect(dialog.message).toContainText('Are you sure');
    });

    test('should close dialog when cancelling delete', async ({ page }) => {
      const deleteBtn = faqsPage.getDeleteButton(0);
      await deleteBtn.click();
      const dialog = new ConfirmDialogComponent(page);
      await dialog.waitForOpen();
      await dialog.cancel();
      await expect(dialog.root).not.toBeVisible();
    });
  });
});
