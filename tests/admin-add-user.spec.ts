import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { AddUserPage } from '../pages/AddUserPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM Admin - Add User', () => {
  test('should add, search, edit, search again and delete a system user', async ({ page }) => {
    test.setTimeout(120_000);

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const addUserPage = new AddUserPage(page);

    // Keep username within OrangeHRM limits; edit only status for a stable search key
    const uniqueUsername = `autoU${Date.now()}`;
    const password = 'Test@1234';

    // --- Login ---
    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // --- Add user ---
    await adminPage.openAdminModule();
    await adminPage.clickAdd();
    await addUserPage.expectAddUserFormVisible();
    await addUserPage.fillUserDetails({
      userRole: 'ESS',
      employeeNameHint: 'Ranga',
      status: 'Enabled',
      username: uniqueUsername,
      password,
    });
    await addUserPage.save();
    await adminPage.expectSavedSuccessfully();

    // --- Search newly created user ---
    await adminPage.searchUser(uniqueUsername);
    await adminPage.expectUserInTable(uniqueUsername);
    await expect(adminPage.userRow(uniqueUsername)).toContainText('ESS');
    await expect(adminPage.userRow(uniqueUsername)).toContainText('Enabled');

    // --- Edit user status and save ---
    await adminPage.openEditForUser(uniqueUsername);
    await addUserPage.expectEditUserFormVisible();
    await addUserPage.updateStatus('Disabled');
    await addUserPage.save();
    await adminPage.expectSavedSuccessfully();

    // --- Search same user and verify edit ---
    await adminPage.searchUser(uniqueUsername);
    await adminPage.expectUserInTable(uniqueUsername);
    await expect(adminPage.userRow(uniqueUsername)).toContainText('Disabled');

    // --- Delete user and verify removal ---
    await adminPage.deleteUser(uniqueUsername);
    await adminPage.searchUser(uniqueUsername);
    await adminPage.expectUserNotInTable(uniqueUsername);
  });
});
