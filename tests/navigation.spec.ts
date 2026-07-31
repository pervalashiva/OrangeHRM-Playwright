import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SideMenuPage } from '../pages/SideMenuPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM Module Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await new DashboardPage(page).expectLoaded();
  });

  test('should open PIM employee list from side menu', async ({ page }) => {
    const menu = new SideMenuPage(page);
    await menu.openPim();
    await expect(page.getByRole('heading', { name: 'PIM' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' }).first()).toBeVisible();
  });

  test('should open Leave module from side menu', async ({ page }) => {
    const menu = new SideMenuPage(page);
    await menu.openLeave();
    await expect(page.getByRole('heading', { name: 'Leave', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
  });

  test('should open My Info personal details from side menu', async ({ page }) => {
    const menu = new SideMenuPage(page);
    await menu.openMyInfo();
    await expect(page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator('.orangehrm-edit-employee-name')).toBeVisible({ timeout: 30_000 });
  });
});
