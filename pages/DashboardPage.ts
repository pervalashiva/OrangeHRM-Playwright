import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly aboutLink: Locator;
  readonly changePasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByText('Logout', { exact: true });
    this.aboutLink = page.getByText('About', { exact: true });
    this.changePasswordLink = page.getByText('Change Password', { exact: true });
  }

  widget(name: string | RegExp) {
    return this.page.locator('.orangehrm-dashboard-widget-name').filter({ hasText: name });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/dashboard\/index/, { timeout: 45_000 });
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  async expectCoreWidgetsVisible() {
    await expect(this.widget('Time at Work')).toBeVisible();
    await expect(this.widget('My Actions')).toBeVisible();
    await expect(this.widget('Quick Launch')).toBeVisible();
  }

  async openUserMenu() {
    await this.userDropdown.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/auth\/login/, { timeout: 30_000 });
  }
}
