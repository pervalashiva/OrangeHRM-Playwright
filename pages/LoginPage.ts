import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginTitle: Locator;
  readonly orangeHrmLogo: Locator;
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginTitle = page.getByRole('heading', { name: 'Login' });
    this.orangeHrmLogo = page.locator('img[alt="company-branding"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginPageLoaded() {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.loginTitle).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
