import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM Dashboard & Logout', () => {
  test('should show core dashboard widgets after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await dashboard.expectLoaded();
    await dashboard.expectCoreWidgetsVisible();
  });

  test('should logout successfully and return to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await dashboard.expectLoaded();

    await dashboard.logout();
    await loginPage.expectLoginPageLoaded();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
