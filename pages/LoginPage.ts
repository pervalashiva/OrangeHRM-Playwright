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
  readonly csrfError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginTitle = page.getByRole('heading', { name: 'Login' });
    this.orangeHrmLogo = page.locator('img[alt="company-branding"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.csrfError = page.getByText('CSRF token validation failed');
  }

  /**
   * Ensure i18n messages load in English.
   * OS 5.9 login has no language dropdown; strings come from /core/i18n/messages.
   */
  async forceEnglishI18n() {
    await this.page.unroute(/\/core\/i18n\/messages/).catch(() => undefined);
    await this.page.route(/\/core\/i18n\/messages/, async (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set('locale', 'en_US');
      await route.continue({ url: url.toString() });
    });
  }

  async goto() {
    await this.forceEnglishI18n();
    await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await expect(this.loginButton).toBeVisible({ timeout: 30_000 });
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username');
  }

  async login(username: string, password: string) {
    await this.submitCredentials(username, password);

    // Browser password popups / stale pages can cause CSRF failures — retry once with a fresh token
    if (await this.csrfError.isVisible().catch(() => false)) {
      await this.goto();
      await this.submitCredentials(username, password);
    }
  }

  private async submitCredentials(username: string, password: string) {
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
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
    await expect(this.loginButton).toHaveText(/^\s*Login\s*$/);
  }
}
