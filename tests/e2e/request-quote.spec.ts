import { expect, test } from '../../src/fixtures/test';
import type { QuoteRequestDetails } from '../../src/models/quote-request';
import { attachJson } from '../../src/reporting/test-attachments';
import { createQuoteRequestData } from '../../src/test-data/quote-request-data';

const validQuoteRequest: Partial<QuoteRequestDetails> = {
  industry: 'Technology & Electronics',
  services: ['Technology Integration'],
  timeline: 'Flexible',
};

test.describe('quote request', () => {
  test(
    'should submit a quote request with valid details',
    { tag: '@smoke' },
    async ({ homePage, quoteRequestPage }, testInfo) => {
      const quoteRequest = createQuoteRequestData(validQuoteRequest);

      await attachJson(testInfo, 'quote-request-data', quoteRequest);

      await test.step('Start a quote request from the site navigation', async () => {
        await homePage.open();
        await homePage.navigation.startQuoteRequest();

        await expect(quoteRequestPage.heading).toBeVisible();
      });

      await test.step('Submit the quote request and confirm it was received', async () => {
        const successMessage = await quoteRequestPage.submitQuote(quoteRequest);

        expect(successMessage).toBe(
          'Thank you for your request! We will contact you within 24 hours.',
        );
      });
    },
  );
});
