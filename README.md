# OrangeHRM Playwright Automation

Playwright + TypeScript UI automation for the [OrangeHRM demo login](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).

## Setup

```bash
npm install
npx playwright install chromium
```

## Run tests

```bash
# Headless
npm test

# Headed (browser visible)
npm run test:headed

# Interactive UI mode
npm run test:ui

# HTML report
npm run report
```

## Test coverage

| Test | Description |
|------|-------------|
| Launch login page | Opens the site and verifies login UI |
| Valid login | Logs in with Admin / admin123 |
| Invalid login | Asserts "Invalid credentials" error |
| Empty credentials | Asserts Required field messages |
| Forgot password | Navigates to reset password page |

Demo credentials (public OrangeHRM sample): `Admin` / `admin123`
