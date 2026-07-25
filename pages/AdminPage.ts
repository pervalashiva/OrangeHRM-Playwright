import { type Locator, type Page, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly adminMenu: Locator;
  readonly addButton: Locator;
  readonly systemUsersHeading: Locator;
  readonly searchButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.successToast = page.locator('.oxd-toast').filter({ hasText: 'Successfully Saved' });
  }

  async openAdminModule() {
    await this.adminMenu.click();
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/);
    await expect(this.systemUsersHeading).toBeVisible();
  }

  async clickAdd() {
    await this.addButton.click();
    await expect(this.page).toHaveURL(/admin\/saveSystemUser/);
  }

  async searchUser(username: string) {
    const usernameField = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input.oxd-input');
    await usernameField.fill(username);
    await this.searchButton.click();
  }

  async expectUserInTable(username: string) {
    const row = this.page.locator('.oxd-table-card').filter({ hasText: username });
    await expect(row).toBeVisible({ timeout: 15_000 });
  }
}
