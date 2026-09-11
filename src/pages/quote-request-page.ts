import type { Locator, Page } from '@playwright/test';

import {
  QUOTE_SERVICES,
  type QuoteRequestDetails,
  type QuoteService,
} from '../models/quote-request';

export class QuoteRequestPage {
  private readonly form: Locator;
  private readonly hydratedFormIsland: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly companyInput: Locator;
  private readonly industrySelect: Locator;
  private readonly timelineSelect: Locator;
  private readonly volumeInput: Locator;
  private readonly detailsInput: Locator;
  private readonly submitButton: Locator;
  public readonly heading: Locator;

  public constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      level: 1,
      name: 'Request a Quote',
    });
    this.form = page.locator('form#rfq-form');
    this.hydratedFormIsland = this.form.locator(
      'xpath=ancestor::astro-island[not(@ssr)]',
    );
    this.firstNameInput = this.form.getByLabel('First Name');
    this.lastNameInput = this.form.getByLabel('Last Name');
    this.emailInput = this.form.getByLabel('Email Address');
    this.phoneInput = this.form.getByLabel('Phone Number');
    this.companyInput = this.form.getByLabel('Company Name');
    this.industrySelect = this.form.getByLabel('Industry');
    this.timelineSelect = this.form.getByLabel('Timeline');
    this.volumeInput = this.form.getByLabel('Estimated Monthly Volume');
    this.detailsInput = this.form.getByLabel('Project Details');
    this.submitButton = this.form.getByRole('button', {
      name: 'Submit Request',
    });
  }

  private async selectServices(
    selectedServices: QuoteRequestDetails['services'],
  ): Promise<void> {
    const selected = new Set<QuoteService>(selectedServices);

    for (const service of QUOTE_SERVICES) {
      const checkbox = this.form.getByRole('checkbox', {
        name: service,
        exact: true,
      });
      const isSelected =
        (await checkbox.getAttribute('aria-checked')) === 'true';

      if (isSelected !== selected.has(service)) {
        await checkbox.click();
      }
    }
  }

  private async fillQuoteRequest(details: QuoteRequestDetails): Promise<void> {
    // Wait until the form is fully initialized so entered values are not reset.
    await this.hydratedFormIsland.waitFor();

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.companyInput.fill(details.company);
    await this.industrySelect.selectOption({ label: details.industry });
    await this.selectServices(details.services);
    await this.timelineSelect.selectOption({ label: details.timeline });
    await this.volumeInput.fill(details.volume ?? '');
    await this.detailsInput.fill(details.details);
  }

  public async submitQuote(details: QuoteRequestDetails): Promise<string> {
    await this.fillQuoteRequest(details);

    const [confirmationMessage] = await Promise.all([
      (async () => {
        const dialog = await this.page.waitForEvent('dialog');
        const message = dialog.message();
        await dialog.accept();
        return message;
      })(),
      this.submitButton.click(),
    ]);

    return confirmationMessage;
  }
}
