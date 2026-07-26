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
  readonly languageDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    // Placeholders stay English on OrangeHRM even when UI language changes for some labels,
    // but we still switch language first before asserting English button/heading text.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginTitle = page.getByRole('heading', { name: 'Login' });
    this.orangeHrmLogo = page.locator('img[alt="company-branding"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.languageDropdown = page.locator('.orangehrm-login-footer-sm .oxd-select-text').first();
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await this.ensureEnglishLanguage();
  }

  /**
   * Shared demo language can be changed by other users.
   * Select English on the login language dropdown before interacting with English labels.
   */
  async ensureEnglishLanguage() {
    // Language-agnostic wait: username field / branding always render on login
    await this.page.locator('input[name="username"], input[placeholder="Username"]').first().waitFor({
      state: 'visible',
      timeout: 30_000,
    });

    const dropdown = this.languageDropdown;
    if (await dropdown.count() === 0 || !(await dropdown.isVisible().catch(() => false))) {
      // Fallback: any select on the login card/footer
      const fallback = this.page.locator('.oxd-select-text').last();
      if (await fallback.isVisible().catch(() => false)) {
        await this.selectEnglishFrom(fallback);
      }
      return;
    }

    await this.selectEnglishFrom(dropdown);
  }

  private async selectEnglishFrom(dropdown: Locator) {
    const selected = (await dropdown.innerText()).trim();
    if (/english/i.test(selected)) {
      return;
    }

    await dropdown.click();
    await this.page
      .locator('.oxd-select-dropdown .oxd-select-option, [role="listbox"] [role="option"]')
      .filter({ hasText: /English/i })
      .first()
      .click();

    // Wait for UI to reload into English
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 15_000 });
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
