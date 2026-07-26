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

    const uniqueUsername = `autoUser${Date.now()}`;
    const editedUsername = `${uniqueUsername}_edit`;
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
    await expect(adminPage.successToast).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/admin\/viewSystemUsers/, { timeout: 15_000 });

    // --- Search newly created user ---
    await adminPage.searchUser(uniqueUsername);
    await adminPage.expectUserInTable(uniqueUsername);
    await expect(adminPage.userRow(uniqueUsername)).toContainText('ESS');
    await expect(adminPage.userRow(uniqueUsername)).toContainText('Enabled');

    // --- Edit user (username + status) and save ---
    await adminPage.openEditForUser(uniqueUsername);
    await addUserPage.expectEditUserFormVisible();
    await addUserPage.updateUsername(editedUsername);
    await addUserPage.updateStatus('Disabled');
    await addUserPage.save();
    await expect(adminPage.successToast).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/admin\/viewSystemUsers/, { timeout: 15_000 });

    // --- Search edited user and verify updates ---
    await adminPage.searchUser(editedUsername);
    await adminPage.expectUserInTable(editedUsername);
    await expect(adminPage.userRow(editedUsername)).toContainText('Disabled');

    // --- Delete user and verify removal ---
    await adminPage.deleteUser(editedUsername);
    await adminPage.searchUser(editedUsername);
    await adminPage.expectUserNotInTable(editedUsername);
  });
});
