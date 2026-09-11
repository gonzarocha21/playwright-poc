import { test as base } from '@playwright/test';

import { AppApi } from '../api/app-api';

interface ApiFixtures {
  readonly appApi: AppApi;
}

/**
 * API-focused test runner. Uses Playwright's built-in `request`
 * (`APIRequestContext`) fixture — no extra HTTP client.
 */
export const test = base.extend<ApiFixtures>({
  appApi: async ({ request }, use) => {
    await use(new AppApi(request));
  },
});

export { expect } from '@playwright/test';
