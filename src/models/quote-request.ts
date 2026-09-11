export const INDUSTRIES = [
  'E-Commerce & Retail',
  'Healthcare & Pharmaceuticals',
  'Automotive & Manufacturing',
  'Technology & Electronics',
  'Consumer Goods',
  'Food & Beverage',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const QUOTE_SERVICES = [
  'Warehousing & Storage',
  'Manufacturing Services',
  'Transportation & Distribution',
  'Supply Chain Management',
  'Value-Added Services',
  'Technology Integration',
] as const;

export type QuoteService = (typeof QUOTE_SERVICES)[number];

export const TIMELINES = [
  'Immediate (Within 1 month)',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Flexible',
] as const;

export type Timeline = (typeof TIMELINES)[number];

export interface QuoteRequestDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly company: string;
  readonly industry: Industry;
  readonly services: [QuoteService, ...QuoteService[]];
  readonly timeline: Timeline;
  readonly volume?: string;
  readonly details: string;
}
