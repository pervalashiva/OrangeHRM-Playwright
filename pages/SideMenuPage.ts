import { type Locator, type Page, expect } from '@playwright/test';

/** Left side navigation for OrangeHRM modules. */
export class SideMenuPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  moduleLink(name: string) {
    return this.page.getByRole('link', { name, exact: true });
  }

  async openModule(name: string, urlPattern: RegExp) {
    await this.moduleLink(name).click();
    await expect(this.page).toHaveURL(urlPattern, { timeout: 30_000 });
  }

  async openPim() {
    await this.openModule('PIM', /pim\/viewEmployeeList|pim\/viewPersonalDetails|pim\/addEmployee/);
  }

  async openLeave() {
    await this.openModule('Leave', /leave\//);
  }

  async openMyInfo() {
    await this.openModule('My Info', /pim\/viewPersonalDetails|pim\/viewMyDetails/);
  }

  async openAdmin() {
    await this.openModule('Admin', /admin\//);
  }

  async openTime() {
    await this.openModule('Time', /time\//);
  }
}
