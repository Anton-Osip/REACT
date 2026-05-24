import { HTTP_ERROR_MESSAGES } from './http-errors.ts';

export const throwForErrorResponse = (response: Response): void => {
  if (response.status === 400) {
    throw new Error(HTTP_ERROR_MESSAGES.badRequest);
  }

  if (response.status === 429) {
    throw new Error(HTTP_ERROR_MESSAGES.tooManyRequests);
  }

  if (response.status === 500) {
    throw new Error(HTTP_ERROR_MESSAGES.serverError);
  }

  if (!response.ok) {
    throw new Error(
      `${response.status}: ${response.statusText || 'Request failed'}`
    );
  }
};
