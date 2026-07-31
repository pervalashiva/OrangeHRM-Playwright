import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SideMenuPage } from '../pages/SideMenuPage';
import { PimPage } from '../pages/PimPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM PIM - Add Employee', () => {
  test('should add a new employee and find them in the employee list', async ({ page }) => {
    test.setTimeout(120_000);

    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const menu = new SideMenuPage(page);
    const pim = new PimPage(page);

    const employeeId = `E${Date.now().toString().slice(-9)}`;
    const firstName = 'Auto';
    const lastName = `Emp${Date.now().toString().slice(-5)}`;

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await dashboard.expectLoaded();
    // Shared demo can briefly bounce back to login under load — re-auth once if needed
    if (page.url().includes('/auth/login')) {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
      await dashboard.expectLoaded();
    }

    await menu.openPim();
    await pim.expectEmployeeListLoaded();
    await pim.openAddEmployee();
    await pim.fillEmployeeDetails({
      firstName,
      middleName: 'PW',
      lastName,
      employeeId,
    });
    await pim.saveEmployee();
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({
      timeout: 30_000,
    });
    await pim.expectEmployeeNameContains(firstName);
    await pim.expectEmployeeNameContains(lastName);

    await pim.searchByEmployeeId(employeeId);
    await pim.expectEmployeeInTable(employeeId);
    await expect(pim.employeeRow(employeeId)).toContainText(firstName);
    await expect(pim.employeeRow(employeeId)).toContainText(lastName);
  });
});
