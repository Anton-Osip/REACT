import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

import { setupDefaultCharacterApiMocks } from '@/shared/test-utils/mock-character-api.ts';

beforeEach(() => {
  setupDefaultCharacterApiMocks();
  vi.stubGlobal('scrollTo', vi.fn());
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
