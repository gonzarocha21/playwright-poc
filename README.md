# AstroFlow Playwright test framework

## Purpose

This repository contains end-to-end tests for the public AstroFlow website. The
main business scenario starts on the home page, opens the request-for-quote
journey, submits customer requirements, and verifies that the request is
acknowledged.

The framework is intentionally small, but its Page Objects, Component Objects,
typed fixtures, configuration, reporting, and CI conventions provide a base for
additional AstroFlow journeys.

## Architecture

```text
tests/e2e
   │ business workflows, test.step reporting, and assertions
   ▼
src/fixtures
   │ typed, test-scoped dependency construction
   ▼
src/pages ──────────► src/components
   │ page workflows     reusable UI behavior
   └──────────┬─────────┘
              ▼
       Playwright Page and request fixtures

src/config ──► playwright.config.ts ──► browser projects and artifacts
src/test-data ────────────────────────► typed scenario input
```

- **Tests** describe business workflows. They contain business assertions,
  meaningful `test.step()` boundaries, and native Playwright tags.
- **Fixtures** extend Playwright's base test and lazily provide typed Page
  Objects. Each test requests only the dependencies it uses.
- **Page Objects** model page-level navigation and workflows. `HomePage` and
  `QuoteRequestPage` are currently available.
- **Component Objects** encapsulate genuinely reusable UI sections. The shared
  header navigation is currently the only Component Object; page-specific UI,
  including the quote-request form, remains in its owning Page Object.
- **Configuration** validates environment input separately from Playwright's
  browser projects, retries, reporters, and artifact policies.
- **Test-data factories** create realistic synthetic identities and practically
  unique contact values without adding a data-generation dependency. Tests keep
  behavior-defining choices explicit through factory overrides.
- **Playwright** provides browser automation, assertions, isolated contexts,
  fixtures, `APIRequestContext`, tracing, screenshots, and reports. No parallel
  abstraction layer is maintained.

## Installation

Prerequisites:

- Node.js 24 LTS
- npm

Install the lockfile-defined dependencies and browser binaries:

```bash
npm ci
npx playwright install
```

On a Linux machine that also needs browser system packages, use:

```bash
npx playwright install --with-deps
```

Create the local configuration file:

```bash
cp .env.example .env
```

The committed `package-lock.json` is the authoritative dependency graph and
should remain version-controlled.

## Configuration

`.env.example` documents the required variables without containing secrets:

```dotenv
BASE_URL=https://astroflow.wingflows.com/
```

Copy it to `.env` and change `BASE_URL` when targeting another environment.
`src/config/environment.ts` loads the local file and fails early when the value
is missing or is not an absolute HTTP(S) URL.
The `.env` file and other `.env.*` variants are ignored by Git; only
`.env.example` is version-controlled.

CI supplies `BASE_URL` explicitly in the workflow. Any future passwords or API
keys must use environment variables backed by GitHub Secrets, never source
files.

## Running tests

| Workflow                  | Command                                               |
| ------------------------- | ----------------------------------------------------- |
| Complete browser suite    | `npm test`                                            |
| Headed browser run        | `npm run test:headed`                                 |
| Interactive Playwright UI | `npm run test:ui`                                     |
| Playwright Inspector      | `npm run test:debug`                                  |
| Smoke tests, all browsers | `npm run test:smoke`                                  |
| Chromium smoke tests / CI | `npm run test:smoke:chromium`                         |
| One browser project       | `npm test -- --project=firefox`                       |
| One test file             | `npx playwright test tests/e2e/request-quote.spec.ts` |

Tests use native tags such as `@smoke`. Direct filtering is also available:

```bash
npx playwright test --grep @smoke
```

Useful non-test commands are:

```bash
npm run check          # TypeScript, ESLint, and formatting checks
npm run format         # Format project files
npm run audit          # Fail on high/critical npm vulnerabilities
```

## Reports and debugging

Every run creates a Playwright HTML report in `playwright-report/`. Open the
latest report with:

```bash
npm run report
```

Local output uses Playwright's list reporter; CI uses the compact line reporter.
Screenshots from failed tests are stored under `test-results/`. CI retries failed
tests twice and records a trace on the first retry. A trace contains the action
timeline, DOM snapshots, console messages, and network activity. Open a trace
with:

```bash
npx playwright show-trace path/to/trace.zip
```

The business-level `test.step()` entries tell the workflow story in the HTML
report. Trace Viewer retains the lower-level clicks, fills, locator resolution,
and waiting details. `playwright-report/` and `test-results/` are generated and
ignored by Git.

## CI/CD

`.github/workflows/quality-gate.yml` runs on pull requests, pushes to `main`, and
manual dispatches. It performs the following quality gate:

1. Installs the lockfile dependency graph with `npm ci --ignore-scripts`.
2. Audits dependencies for high or critical vulnerabilities.
3. Runs TypeScript, ESLint, and Prettier checks.
4. Installs Chromium and runs `npm run test:smoke:chromium`.
5. Uploads the HTML report and test artifacts when the job is not cancelled.

Pull requests intentionally use Chromium smoke coverage for fast feedback. The
normal local suite covers Chromium, Firefox, and WebKit. Broader CI browser
coverage can be scheduled separately when the suite and execution budget
justify it.

Dependabot checks npm and GitHub Actions dependencies weekly. It limits each
ecosystem to five open update pull requests.

## Security

- The workflow grants `GITHUB_TOKEN` only `contents: read` and does not persist
  checkout credentials.
- External GitHub Actions are pinned to immutable commit SHAs. Version comments
  make intentional upgrades reviewable.
- CI uses the lockfile and prevents dependency lifecycle scripts during
  installation. Playwright installs its required browser explicitly.
- Credentials belong in local ignored environment files or GitHub Secrets. They
  must not appear in test data, configuration committed to Git, console output,
  or workflow source.
- Reports are retained for 14 days. Traces and screenshots may expose page data
  and should remain available only to authorized repository users.

## Adding new tests

1. Add business scenarios under `tests/e2e/` and give each test a descriptive
   outcome-focused name.
2. Import `test` and `expect` from `src/fixtures/test` when the scenario uses
   application Page Objects. Request only the fixtures the test needs.
3. Add a Page Object for page-level workflows. Add a Component Object only for
   behavior that is genuinely reused across the application.
4. Prefer accessible, user-facing locators such as `getByRole()` and
   `getByLabel()`. Scope locators to their owning page or component.
5. Rely on Playwright's locator auto-waiting and web-first assertions. Do not use
   `waitForTimeout()` for synchronization.
6. Keep business assertions visible in the spec. Objects should perform actions
   and expose observable state or results; avoid methods such as
   `submitAndVerifySuccess()`.
7. Use `test.step()` for business phases, not individual clicks or field fills.
8. Apply only relevant native Playwright tags. Do not build a custom tagging
   layer.
9. Keep tests independent of execution order. Generate unique data and clean up
   persisted entities whenever a scenario writes shared application state. Use
   a typed factory from `src/test-data/` rather than copying large data objects.

For example:

```ts
import { expect, test } from '../../src/fixtures/test';
import type { QuoteRequestDetails } from '../../src/models/quote-request';
import { createQuoteRequestData } from '../../src/test-data/quote-request-data';

const validQuoteRequest: Partial<QuoteRequestDetails> = {
  industry: 'Technology & Electronics',
  services: ['Technology Integration'],
  timeline: 'Flexible',
};

test(
  'should submit a quote request with valid details',
  {
    tag: '@smoke',
  },
  async ({ homePage, quoteRequestPage }) => {
    const quoteRequest = createQuoteRequestData(validQuoteRequest);

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
```

## Architectural decisions

- **Fixtures instead of large hooks:** typed, lazy fixtures make dependencies
  explicit and preserve Playwright's test isolation. Hooks are not used as a
  hidden dependency-injection system.
- **Composition instead of `BasePage` inheritance:** pages compose the shared
  header navigation where needed, while page-specific forms remain in their
  owning Page Objects. There is no generic base class filled with unrelated
  helpers.
- **Native API support instead of Axios:** the extended test retains
  Playwright's typed `request: APIRequestContext` fixture. When a real API is
  available, it can create setup data, validate responses, and clean up without
  another HTTP dependency. Mock endpoints are not invented without a contract.
- **Playwright HTML report instead of Allure:** HTML reports, screenshots, and
  traces meet current diagnostic needs without another reporting dependency.
  JUnit can be added only if CI or test-management interoperability requires it.
- **Business assertions remain in tests:** Page and Component Objects expose
  actions and state, allowing reviewers to understand validations from the spec.
- **Environment configuration is separate from browser projects:** environment
  loading and validation live in `src/config/environment.ts`; browser/device and
  artifact policy live in `playwright.config.ts`.
- **PR smoke coverage is separate from broader browser coverage:** CI runs the
  high-value Chromium smoke suite for speed, while `npm test` provides the
  broader three-browser suite.
- **Random identity, explicit business inputs:** factories may randomize names
  and unique contact details, while scenarios override industry, service, or
  timeline choices that define the behavior under test. Generated data is
  attached to the report for failure diagnosis.

## Future scaling

The suite already uses test-scoped fixtures and `fullyParallel`, so additional
workers can be used safely. The following extensions should be introduced only
when a demonstrated need appears:

- CI sharding when suite duration justifies the coordination and artifact merge
  overhead.
- Scheduled or release-gated cross-browser and device matrices.
- Additional environments selected through validated configuration rather than
  duplicated Playwright projects.
- Typed API clients built on `APIRequestContext` for broader API and API-to-UI
  testing.
- JUnit or another test-management integration when an external consumer needs
  it.
- More Page and Component Objects as the tested product surface grows.
