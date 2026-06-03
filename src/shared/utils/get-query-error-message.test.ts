import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { HTTP_ERROR_MESSAGES } from '@/shared/api/http-errors';

import { getQueryErrorMessage } from './get-query-error-message.ts';

const axiosErrorWithStatus = (status: number) =>
  new AxiosError('Request failed', undefined, undefined, undefined, {
    status,
    data: {},
    statusText: '',
    headers: {},
    config: {} as never,
  });

describe('getQueryErrorMessage', () => {
  it('returns message from Error instance', () => {
    expect(getQueryErrorMessage(new Error('Network failed'))).toBe(
      'Network failed'
    );
  });

  it('returns string errors as-is', () => {
    expect(getQueryErrorMessage('plain string failure')).toBe(
      'plain string failure'
    );
  });

  it('returns fallback message for unknown error values', () => {
    expect(getQueryErrorMessage({ code: 500 })).toBe(
      'An unexpected error occurred'
    );
  });

  it('maps axios 400 errors to bad request message', () => {
    expect(getQueryErrorMessage(axiosErrorWithStatus(400))).toBe(
      HTTP_ERROR_MESSAGES.badRequest
    );
  });

  it('maps axios 404 errors to not found message', () => {
    expect(getQueryErrorMessage(axiosErrorWithStatus(404))).toBe(
      HTTP_ERROR_MESSAGES.notFound
    );
  });

  it('maps axios 429 errors to too many requests message', () => {
    expect(getQueryErrorMessage(axiosErrorWithStatus(429))).toBe(
      HTTP_ERROR_MESSAGES.tooManyRequests
    );
  });

  it('maps axios 5xx errors to server error message', () => {
    expect(getQueryErrorMessage(axiosErrorWithStatus(500))).toBe(
      HTTP_ERROR_MESSAGES.serverError
    );
  });

  it('returns network error message when axios has no response', () => {
    const error = new AxiosError('Network Error');
    error.response = undefined;

    expect(getQueryErrorMessage(error)).toBe(
      'Network error. Please check your connection and try again.'
    );
  });
});
