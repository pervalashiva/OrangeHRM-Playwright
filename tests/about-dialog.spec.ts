import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM About Dialog', () => {
  test('should open About dialog from user menu and show product details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await dashboard.expectLoaded();

    await dashboard.openAboutDialog();
    await dashboard.expectAboutDialogDetails();
    await dashboard.closeAboutDialog();

    // Dashboard remains usable after closing the dialog
    await expect(dashboard.heading).toBeVisible();
  });
});
