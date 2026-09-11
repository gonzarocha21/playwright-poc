import { randomInt, randomUUID } from 'node:crypto';
import {
  INDUSTRIES,
  QUOTE_SERVICES,
  TIMELINES,
  type QuoteRequestDetails,
} from '../models/quote-request';

const FIRST_NAMES = ['Ada', 'Grace', 'Linus', 'Maya', 'Nora'] as const;
const LAST_NAMES = [
  'Lovelace',
  'Hopper',
  'Torvalds',
  'Angelou',
  'Jones',
] as const;
const COMPANY_NAMES = [
  'Northstar Logistics',
  'Bluebird Retail',
  'Summit Manufacturing',
  'Orbit Technologies',
] as const;
const PROJECT_DETAILS = [
  'Needs a scalable logistics solution for planned growth.',
  'Is evaluating distribution and storage options.',
  'Would like a proposal for improving supply-chain operations.',
] as const;

function randomItem<Item>(values: readonly [Item, ...Item[]]): Item {
  const randomIndex = randomInt(values.length);
  return values[randomIndex]!;
}

// Converts a UUID into a fixed-length numeric suffix for the test phone number.
function numericId(uuid: string): string {
  const value = BigInt(`0x${uuid.replaceAll('-', '')}`) % 1_000_000_000_000n;
  return value.toString().padStart(12, '0');
}

export function createQuoteRequestData(
  overrides: Partial<QuoteRequestDetails> = {},
): QuoteRequestDetails {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const testRunId = randomUUID();

  return {
    firstName,
    lastName,
    email: `${firstName}.${lastName}.${testRunId}@example.test`.toLowerCase(),
    // +999 is deliberately non-routable; the UUID-derived subscriber number
    // makes collisions exceedingly unlikely without shared mutable state.
    phone: `+999${numericId(testRunId)}`,
    company: randomItem(COMPANY_NAMES),
    industry: randomItem(INDUSTRIES),
    services: [randomItem(QUOTE_SERVICES)],
    timeline: randomItem(TIMELINES),
    details: `${randomItem(PROJECT_DETAILS)} Test reference: ${testRunId}.`,
    ...overrides,
  };
}
