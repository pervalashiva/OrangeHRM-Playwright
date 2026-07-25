import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { AddUserPage } from '../pages/AddUserPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM Admin - Add User', () => {
  test('should add a new system user after login via Admin > Add', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const addUserPage = new AddUserPage(page);

    const uniqueUsername = `autoUser${Date.now()}`;
    const password = 'Test@1234';

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await adminPage.openAdminModule();
    await adminPage.clickAdd();

    await addUserPage.expectAddUserFormVisible();
    await addUserPage.fillUserDetails({
      userRole: 'ESS',
      // Partial name triggers OrangeHRM employee autocomplete
      employeeNameHint: 'Ranga',
      status: 'Enabled',
      username: uniqueUsername,
      password,
    });
    await addUserPage.save();

    await expect(adminPage.successToast).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/admin\/viewSystemUsers/, { timeout: 15_000 });
    await expect(adminPage.systemUsersHeading).toBeVisible();

    await adminPage.searchUser(uniqueUsername);
    await adminPage.expectUserInTable(uniqueUsername);
    await expect(page.locator('.oxd-table-card').filter({ hasText: uniqueUsername })).toContainText('ESS');
    await expect(page.locator('.oxd-table-card').filter({ hasText: uniqueUsername })).toContainText('Enabled');
  });
});
