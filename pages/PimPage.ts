import { type Locator, type Page, expect } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addButton: Locator;
  readonly employeeListLink: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;
  readonly employeeNameHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'PIM' });
    this.addButton = page.getByRole('button', { name: 'Add' }).first();
    this.employeeListLink = page.getByRole('link', { name: 'Employee List' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successToast = page.locator('.oxd-toast').filter({ hasText: /Successfully Saved/i });
    this.employeeNameHeader = page.locator('.orangehrm-edit-employee-name');
  }

  employeeIdInput() {
    return this.page
      .locator('.oxd-input-group')
      .filter({ hasText: /Employee Id/i })
      .locator('input');
  }

  searchEmployeeIdInput() {
    return this.page
      .locator('.oxd-input-group')
      .filter({ hasText: /Employee Id/i })
      .locator('input')
      .first();
  }

  async expectEmployeeListLoaded() {
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
    await expect(this.heading).toBeVisible();
  }

  async openAddEmployee() {
    await this.addButton.click();
    await expect(this.page).toHaveURL(/pim\/addEmployee/);
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillEmployeeDetails(details: {
    firstName: string;
    middleName?: string;
    lastName: string;
    employeeId: string;
  }) {
    await this.firstNameInput.fill(details.firstName);
    if (details.middleName) {
      await this.middleNameInput.fill(details.middleName);
    }
    await this.lastNameInput.fill(details.lastName);
    await this.employeeIdInput().fill(details.employeeId);
  }

  async saveEmployee() {
    await this.saveButton.click();
    await Promise.race([
      this.successToast.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
      this.page.waitForURL(/pim\/viewPersonalDetails/, { timeout: 30_000 }),
    ]);
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 30_000 });
  }

  async expectEmployeeNameContains(text: string) {
    await expect(this.employeeNameHeader).toContainText(text, { timeout: 15_000 });
  }

  async searchByEmployeeId(employeeId: string) {
    await this.employeeListLink.click();
    await this.expectEmployeeListLoaded();
    const idField = this.searchEmployeeIdInput();
    await idField.fill('');
    await idField.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  employeeRow(employeeId: string) {
    return this.page.locator('.oxd-table-card').filter({ hasText: employeeId });
  }

  async expectEmployeeInTable(employeeId: string) {
    await expect(this.employeeRow(employeeId)).toBeVisible({ timeout: 15_000 });
  }
}
