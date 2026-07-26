# OrangeHRM Playwright Automation

Playwright + TypeScript UI automation for the [OrangeHRM demo login](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).

The shared demo often serves Spanish (or another language) because admin default localization is changed by other users. OrangeHRM OS 5.9 login has **no language dropdown** — UI text comes from `/core/i18n/messages`.

Tests force English by intercepting that API and requesting `?locale=en_US` (see `fixtures/test.ts`).

## Setup

```bash
npm install
npx playwright install chromium
```

Java is required only if you generate Allure reports locally (`allure-commandline`).

## Run tests locally

### Full suite

```bash
npm test
# or
npm run test:suite
```

### Individual test cases

```bash
npm run test:launch
npm run test:valid-login
npm run test:invalid-login
npm run test:empty-credentials
npm run test:forgot-password
npm run test:add-user
```

### Reports

```bash
npm run report           # Playwright HTML report
npm run allure:generate  # build Allure HTML from allure-results
npm run allure:open      # open Allure report
npm run allure:report    # generate + open Allure
```

```bash
npm run test:headed   # browser visible
npm run test:ui       # Playwright UI mode
```

## Run tests via GitHub Actions

1. Open the repo on GitHub → **Actions** → **Playwright Tests**
2. Click **Run workflow**
3. Choose:
   - `all` — full suite
   - or a single case (`launch-login-page`, `valid-login`, `invalid-credentials`, `empty-credentials`, `forgot-password`, `add-user`)
4. After **every** run, download artifacts (even if tests fail):
   - `allure-report-*` — open `index.html` in a browser
   - `allure-results-*` — raw Allure data
   - `playwright-report-*` — Playwright HTML report
   - `test-results-*` — screenshots / videos / traces on failure

The same workflow also runs automatically on pushes to `main` / `feature/**` and on pull requests.

## Project structure

```
.github/workflows/playwright.yml  # CI: suite + individual cases + Allure
fixtures/test.ts                  # Forces English via i18n API intercept
pages/LoginPage.ts                # Page Object for the login screen
tests/login.spec.ts               # Launch + login test cases
playwright.config.ts              # Base URL, browser, Allure reporter
```

## Test coverage

| Selection (Actions) | npm script | Description |
|---------------------|------------|-------------|
| `all` | `test:suite` | Full suite |
| `launch-login-page` | `test:launch` | Opens the site and verifies login UI |
| `valid-login` | `test:valid-login` | Logs in with Admin / admin123 |
| `invalid-credentials` | `test:invalid-login` | Asserts "Invalid credentials" error |
| `empty-credentials` | `test:empty-credentials` | Asserts Required field messages |
| `forgot-password` | `test:forgot-password` | Navigates to reset password page |
| `add-user` | `test:add-user` | Login → Admin → Add User → save + assert |

Demo credentials (public OrangeHRM sample): `Admin` / `admin123`
