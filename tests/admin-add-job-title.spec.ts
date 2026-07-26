import fs from 'fs';
import path from 'path';
import { test, expect } from '../fixtures/test';
import { LoginPage } from '../pages/LoginPage';
import { JobTitlesPage } from '../pages/JobTitlesPage';
import { AddJobTitlePage } from '../pages/AddJobTitlePage';

const VALID_USERNAME = 'Admin';
const VALID_PASSWORD = 'admin123';

const SPEC_FILE = path.join(__dirname, '../test-data/job-specification.txt');

function ensureDummySpecificationFile() {
  const dir = path.dirname(SPEC_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SPEC_FILE)) {
    fs.writeFileSync(
      SPEC_FILE,
      [
        'OrangeHRM automation dummy job specification',
        `Generated at ${new Date().toISOString()}`,
        'Used by Playwright Add Job Title test.',
      ].join('\n'),
      'utf8'
    );
  }
}

test.describe('OrangeHRM Admin - Add Job Title', () => {
  test('should add a job title with details, file upload, save and verify', async ({ page }) => {
    ensureDummySpecificationFile();

    const loginPage = new LoginPage(page);
    const jobTitlesPage = new JobTitlesPage(page);
    const addJobTitlePage = new AddJobTitlePage(page);

    const uniqueJobTitle = `Auto Job Title ${Date.now()}`;
    const description = 'Automated job description created by Playwright.';
    const note = 'Dummy note for job title automation.';

    await loginPage.goto();
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/dashboard\/index/);

    await jobTitlesPage.openJobTitles();
    await jobTitlesPage.clickAdd();

    await addJobTitlePage.expectFormVisible();
    await addJobTitlePage.fillDetails({
      jobTitle: uniqueJobTitle,
      jobDescription: description,
      note,
      specificationFilePath: SPEC_FILE,
    });
    await addJobTitlePage.save();

    await expect(jobTitlesPage.successToast).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/admin\/viewJobTitleList/, { timeout: 15_000 });
    await expect(jobTitlesPage.jobTitlesHeading).toBeVisible();
    await jobTitlesPage.expectJobTitleInTable(uniqueJobTitle);
  });
});
