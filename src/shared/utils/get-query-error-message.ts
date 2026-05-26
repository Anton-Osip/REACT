import { isAxiosError } from 'axios';

import { HTTP_ERROR_MESSAGES } from '@/shared/api/http-errors';

export function getQueryErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 400) return HTTP_ERROR_MESSAGES.badRequest;
    if (status === 404) return HTTP_ERROR_MESSAGES.notFound;
    if (status === 429) return HTTP_ERROR_MESSAGES.tooManyRequests;
    if (status != null && status >= 500) return HTTP_ERROR_MESSAGES.serverError;
    if (!error.response) {
      return 'Network error. Please check your connection and try again.';
    }
  }
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}
