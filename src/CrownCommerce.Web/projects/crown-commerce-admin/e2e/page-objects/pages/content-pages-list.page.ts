import { Locator, Page } from '@playwright/test';
import { SidebarComponent } from '../components/sidebar.component';
import { ToolbarComponent } from '../components/toolbar.component';
import { DataTableComponent } from '../components/data-table.component';

export class ContentPagesListPage {
  readonly sidebar: SidebarComponent;
  readonly toolbar: ToolbarComponent;
  readonly dataTable: DataTableComponent;

  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly searchField: Locator;

  constructor(private page: Page) {
    this.sidebar = new SidebarComponent(page);
    this.toolbar = new ToolbarComponent(page);
    this.dataTable = new DataTableComponent(page);

    this.pageTitle = page.locator('.page-header .page-title');
    this.pageSubtitle = page.locator('.page-header .page-subtitle');
    this.searchField = page.locator('.search-field input');
  }

  async goto(): Promise<void> {
    await this.page.goto('/content-pages');
    await this.page.waitForLoadState('domcontentloaded');
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  getDeleteButton(rowIndex: number): Locator {
    return this.dataTable.rows.nth(rowIndex).locator('.actions-cell .action-btn--delete');
  }
}
