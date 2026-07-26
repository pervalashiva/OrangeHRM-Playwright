import { type Locator, type Page, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly adminMenu: Locator;
  readonly addButton: Locator;
  readonly systemUsersHeading: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly successToast: Locator;
  readonly deletedToast: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.successToast = page.locator('.oxd-toast').filter({ hasText: /Successfully Saved/i });
    this.deletedToast = page.locator('.oxd-toast').filter({ hasText: /Successfully Deleted/i });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  userRow(username: string) {
    return this.page.locator('.oxd-table-card').filter({ hasText: username });
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

  /**
   * Toast messages disappear quickly on OrangeHRM.
   * Treat redirect back to System Users as the durable success signal.
   */
  async expectSavedSuccessfully() {
    await Promise.race([
      this.successToast.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
      this.page.waitForURL(/admin\/viewSystemUsers/, { timeout: 15_000 }),
    ]);
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/, { timeout: 15_000 });
    await expect(this.systemUsersHeading).toBeVisible();
  }

  /** Table empty-state uses <span>; toast uses <p> — keep them distinct for strict mode */
  private get noRecordsInTable() {
    return this.page.locator('span.oxd-text').filter({ hasText: /^No Records Found$/ });
  }

  async expectDeletedSuccessfully() {
    await Promise.race([
      this.deletedToast.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
      this.noRecordsInTable.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined),
    ]);
  }

  async searchUser(username: string) {
    const usernameField = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input.oxd-input');
    await usernameField.fill('');
    await usernameField.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async expectUserInTable(username: string) {
    await expect(this.userRow(username)).toBeVisible({ timeout: 15_000 });
  }

  async expectUserNotInTable(username: string) {
    await expect(this.noRecordsInTable).toBeVisible({ timeout: 15_000 });
    await expect(this.userRow(username)).toHaveCount(0);
  }

  async openEditForUser(username: string) {
    await this.userRow(username).locator('.bi-pencil-fill').click();
    await expect(this.page).toHaveURL(/admin\/saveSystemUser/);
    await expect(this.page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
  }

  async deleteUser(username: string) {
    await this.userRow(username).locator('.bi-trash').click();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
    await this.expectDeletedSuccessfully();
  }
}
