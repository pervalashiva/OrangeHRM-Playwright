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
    // name= attributes are language-independent (Spanish uses different placeholders/labels)
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.loginTitle = page.getByRole('heading', { name: 'Login' });
    this.orangeHrmLogo = page.locator('img[alt="company-branding"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await this.ensureEnglishLanguage();
  }

  /**
   * Shared demo default language is often changed by other users (e.g. Spanish).
   * Always switch the login-page language dropdown to English before assertions.
   */
  async ensureEnglishLanguage() {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30_000 });

    const alreadyEnglish = await this.page
      .getByRole('button', { name: /^Login$/i })
      .isVisible()
      .catch(() => false);

    if (alreadyEnglish) {
      return;
    }

    // Login page has a single oxd language select (usually at the bottom)
    const languageDropdown = this.page.locator('.oxd-select-text').last();
    await expect(languageDropdown, 'Language dropdown should be visible on login page').toBeVisible({
      timeout: 15_000,
    });
    await languageDropdown.scrollIntoViewIfNeeded();
    await languageDropdown.click();

    const englishOption = this.page
      .locator('.oxd-select-dropdown .oxd-select-option, [role="listbox"] [role="option"]')
      .filter({ hasText: /English\s*\(United States\)|^\s*English\s*$/i })
      .first();

    await expect(englishOption, 'English language option should appear').toBeVisible({ timeout: 10_000 });
    await englishOption.click();

    // OrangeHRM reloads translations after language change
    await expect(this.page.getByRole('button', { name: /^Login$/i })).toBeVisible({ timeout: 20_000 });
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username', { timeout: 20_000 });
  }

  async login(username: string, password: string) {
    await this.ensureEnglishLanguage();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginPageLoaded() {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.page.getByRole('button', { name: /^Login$/i })).toBeVisible();
  }
}
