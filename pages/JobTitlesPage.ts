import { type Locator, type Page, expect } from '@playwright/test';

export class JobTitlesPage {
  readonly page: Page;
  readonly adminMenu: Locator;
  readonly jobTopMenu: Locator;
  readonly jobTitlesMenuItem: Locator;
  readonly jobTitlesHeading: Locator;
  readonly addButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin' });
    this.jobTopMenu = page.locator('.oxd-topbar-body-nav').getByText('Job', { exact: true });
    this.jobTitlesMenuItem = page.getByRole('menuitem', { name: 'Job Titles' });
    this.jobTitlesHeading = page.getByRole('heading', { name: 'Job Titles' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.successToast = page.locator('.oxd-toast').filter({ hasText: 'Successfully Saved' });
  }

  async openJobTitles() {
    await this.adminMenu.click();
    await expect(this.page).toHaveURL(/admin\//);
    await this.jobTopMenu.click();
    await this.jobTitlesMenuItem.click();
    await expect(this.page).toHaveURL(/admin\/viewJobTitleList/);
    await expect(this.jobTitlesHeading).toBeVisible();
  }

  async clickAdd() {
    await this.addButton.click();
    await expect(this.page).toHaveURL(/admin\/saveJobTitle/);
  }

  async expectJobTitleInTable(jobTitle: string) {
    const row = this.page.locator('.oxd-table-card').filter({ hasText: jobTitle });
    await expect(row).toBeVisible({ timeout: 15_000 });
    await expect(row).toContainText(jobTitle);
  }
}
