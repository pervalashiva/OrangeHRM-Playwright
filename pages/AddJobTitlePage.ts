import path from 'path';
import { type Locator, type Page, expect } from '@playwright/test';

export type AddJobTitleDetails = {
  jobTitle: string;
  jobDescription?: string;
  note?: string;
  specificationFilePath?: string;
};

export class AddJobTitlePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly jobTitleInput: Locator;
  readonly jobDescriptionInput: Locator;
  readonly noteInput: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Add Job Title' });
    this.jobTitleInput = page.locator('.oxd-input-group').filter({ hasText: 'Job Title' }).locator('input');
    this.jobDescriptionInput = page.getByPlaceholder('Type description here');
    this.noteInput = page.getByPlaceholder('Add note');
    this.fileInput = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async expectFormVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.jobTitleInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
  }

  async fillDetails(details: AddJobTitleDetails) {
    await this.jobTitleInput.fill(details.jobTitle);

    if (details.jobDescription) {
      await this.jobDescriptionInput.fill(details.jobDescription);
    }

    if (details.specificationFilePath) {
      await this.fileInput.setInputFiles(path.resolve(details.specificationFilePath));
    }

    if (details.note) {
      await this.noteInput.fill(details.note);
    }
  }

  async save() {
    await this.saveButton.click();
  }
}
