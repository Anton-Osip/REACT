import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithRouter } from '@/shared/test-utils';

describe('index route', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects from / to /character', async () => {
    const { router } = await renderWithRouter('/');

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/character');
      expect(router.state.location.search).toMatchObject({ page: 1 });
    });
  });
});
