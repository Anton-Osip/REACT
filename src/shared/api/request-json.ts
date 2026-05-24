import { throwForErrorResponse } from './throw-for-error-response.ts';

export const requestJson = async <T>(
  url: URL,
  onNotFound: () => T
): Promise<T> => {
  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return onNotFound();
    }

    throwForErrorResponse(response);
    return (await response.json()) as T;
  } catch (error) {
    throw new Error(`HTTP error! ${error}`);
  }
};
