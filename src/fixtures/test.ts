import { test as base } from '@playwright/test';

import { HomePage } from '../pages/home-page';
import { QuoteRequestPage } from '../pages/quote-request-page';

interface PageObjectFixtures {
  readonly homePage: HomePage;
  readonly quoteRequestPage: QuoteRequestPage;
}

export const test = base.extend<PageObjectFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  quoteRequestPage: async ({ page }, use) => {
    await use(new QuoteRequestPage(page));
  },
});

export { expect } from '@playwright/test';
