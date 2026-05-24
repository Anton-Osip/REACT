export const HTTP_ERROR_MESSAGES = {
  badRequest: '400: Bad Request - Invalid search parameters',
  notFound: '404: Bad Request - Invalid search parameters',
  tooManyRequests:
    "You're sending too many requests too quickly. Please wait a moment and try again. Thank you for your patience!;",
  serverError: '500: Internal Server Error - Server is having issues',
} as const;
