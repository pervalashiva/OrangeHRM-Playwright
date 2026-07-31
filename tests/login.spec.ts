import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

test.describe('OrangeHRM Login', () => {
  test('should launch the website and open the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoginPageLoaded();
    await expect(loginPage.orangeHrmLogo).toBeVisible();
    await expect(page).toHaveTitle(/OrangeHRM/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('InvalidUser', 'WrongPassword');

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should show required field validation when credentials are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginButton.click();

    const requiredMessages = page.getByText('Required');
    await expect(requiredMessages).toHaveCount(2);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(/auth\/requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  });

  test('should return to login when Cancel is clicked on forgot password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/auth\/requestPasswordResetCode/);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await loginPage.expectLoginPageLoaded();
  });
});
