import { expect, test } from '../../src/fixtures/api-test';

test.describe('application origin', () => {
  test(
    'should respond successfully through Playwright APIRequest',
    { tag: '@api' },
    async ({ appApi }) => {
      const response = await appApi.getOrigin();

      expect(response.ok()).toBeTruthy();
    },
  );
});
