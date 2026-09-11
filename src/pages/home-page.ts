import type { Page } from '@playwright/test';
import { HeaderNavigation } from '../components/header-navigation';

export class HomePage {
  public readonly navigation: HeaderNavigation;

  public constructor(private readonly page: Page) {
    this.navigation = new HeaderNavigation(page);
  }

  public async open(): Promise<void> {
    await this.page.goto('/');
  }
}
