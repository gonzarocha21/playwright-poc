import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin Playwright `APIRequestContext` wrapper for application HTTP calls.
 * Add endpoint methods here as real API contracts become available.
 */
export class AppApi {
  public constructor(private readonly request: APIRequestContext) {}

  public get(path: string): Promise<APIResponse> {
    return this.request.get(path);
  }

  public getOrigin(): Promise<APIResponse> {
    return this.get('/');
  }

  public getQuoteRequestPage(): Promise<APIResponse> {
    return this.get('/rfq');
  }
}
