import { test as base, expect } from '@playwright/test';

/**
 * OrangeHRM OS 5.9 loads UI strings from /core/i18n/messages.
 * The shared demo admin default language is often not English.
 * Force English by rewriting every i18n request to locale=en_US.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/\/core\/i18n\/messages/, async (route) => {
      const url = new URL(route.request().url());
      url.searchParams.set('locale', 'en_US');
      await route.continue({ url: url.toString() });
    });
    await use(page);
  },
});

export { expect };
