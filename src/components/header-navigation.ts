import type { Locator, Page } from '@playwright/test';

export class HeaderNavigation {
  private readonly requestQuoteLink: Locator;

  public constructor(page: Page) {
    const navigation = page.getByRole('banner').getByRole('navigation');

    this.requestQuoteLink = navigation
      .getByRole('link', {
        name: 'Request Quote',
        exact: true,
      })
      .last();
  }

  public async startQuoteRequest(): Promise<void> {
    await this.requestQuoteLink.click();
  }
}
