import { type Locator, type Page, expect } from '@playwright/test';

export type AddUserDetails = {
  userRole: 'Admin' | 'ESS';
  employeeNameHint: string;
  status: 'Enabled' | 'Disabled';
  username: string;
  password: string;
};

export class AddUserPage {
  readonly page: Page;
  readonly addUserHeading: Locator;
  readonly editUserHeading: Locator;
  readonly employeeNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
    this.editUserHeading = page.getByRole('heading', { name: 'Edit User' });
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.usernameInput = page.locator('.oxd-input-group').filter({ hasText: /^Username/ }).locator('input');
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async expectAddUserFormVisible() {
    await expect(this.addUserHeading).toBeVisible();
    await expect(this.employeeNameInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async expectEditUserFormVisible() {
    await expect(this.editUserHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  private async selectDropdownByLabel(label: string, option: string) {
    const field = this.page.locator('.oxd-input-group').filter({ hasText: label });
    await field.locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option }).click();
  }

  async selectEmployee(hint: string) {
    await this.employeeNameInput.click();
    await this.employeeNameInput.fill('');
    await this.employeeNameInput.pressSequentially(hint, { delay: 80 });

    const option = this.page
      .locator('.oxd-autocomplete-option')
      .filter({ hasNotText: /Searching|No Records Found/i })
      .first();
    await expect(option).toBeVisible({ timeout: 15_000 });
    await option.click();
  }

  async fillUserDetails(details: AddUserDetails) {
    await this.selectDropdownByLabel('User Role', details.userRole);
    await this.selectEmployee(details.employeeNameHint);
    await this.selectDropdownByLabel('Status', details.status);
    await this.usernameInput.fill(details.username);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.password);
  }

  async updateStatus(status: 'Enabled' | 'Disabled') {
    await this.selectDropdownByLabel('Status', status);
  }

  async updateUsername(username: string) {
    await this.usernameInput.fill('');
    await this.usernameInput.fill(username);
  }

  async save() {
    await this.saveButton.click();
  }
}
