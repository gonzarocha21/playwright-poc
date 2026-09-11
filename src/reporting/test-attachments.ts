import type { TestInfo } from '@playwright/test';

export async function attachJson(
  testInfo: TestInfo,
  name: string,
  data: unknown,
): Promise<void> {
  await testInfo.attach(name, {
    body: JSON.stringify(data, null, 2),
    contentType: 'application/json',
  });
}
