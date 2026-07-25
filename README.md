# OrangeHRM Playwright Automation

Playwright + TypeScript UI automation for the [OrangeHRM demo login](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).

## Setup

```bash
npm install
npx playwright install chromium
```

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
```

### Other

```bash
npm run test:headed   # browser visible
npm run test:ui       # Playwright UI mode
npm run report        # open HTML report
```

## Run tests via GitHub Actions

1. Open the repo on GitHub → **Actions** → **Playwright Tests**
2. Click **Run workflow**
3. Choose:
   - `all` — full suite
   - or a single case (`launch-login-page`, `valid-login`, `invalid-credentials`, `empty-credentials`, `forgot-password`)
4. After the run, download artifacts:
   - `playwright-report-*` — HTML report
   - `test-results-*` — screenshots / videos / traces on failure

The same workflow also runs automatically on pushes to `main` / `feature/**` and on pull requests.

## Project structure

```
.github/workflows/playwright.yml  # CI: suite + individual cases
pages/LoginPage.ts                # Page Object for the login screen
tests/login.spec.ts               # Launch + login test cases
playwright.config.ts              # Base URL and browser config
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

Demo credentials (public OrangeHRM sample): `Admin` / `admin123`
