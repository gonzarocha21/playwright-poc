import type { APIResponse } from '@playwright/test';

import { expect, test } from '../../../src/fixtures/api-test';

const PUBLIC_PAGES = [
  { name: 'home', path: '/' },
  { name: 'quote request', path: '/rfq' },
] as const;

function expectStrictTransportSecurity(response: APIResponse): void {
  const strictTransportSecurity =
    response.headers()['strict-transport-security'];

  expect(
    strictTransportSecurity,
    'Strict-Transport-Security header should be present',
  ).toBeTruthy();
  expect(strictTransportSecurity).toMatch(/max-age=\d+/i);
}

test.describe('http security headers', () => {
  for (const page of PUBLIC_PAGES) {
    test(
      `should expose a transport security baseline on the ${page.name} page`,
      { tag: ['@api', '@security'] },
      async ({ appApi }) => {
        const response = await appApi.get(page.path);

        expect(response.ok()).toBeTruthy();
        expectStrictTransportSecurity(response);
      },
    );
  }
});
