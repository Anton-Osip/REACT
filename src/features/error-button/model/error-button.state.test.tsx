import { beforeEach, describe, expect, it } from 'vitest';

import { useErrorButtonStore } from './error-button.state.tsx';

function resetStore() {
  useErrorButtonStore.setState({ shouldThrowError: false });
}

describe('useErrorButtonStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts with shouldThrowError set to false', () => {
    expect(useErrorButtonStore.getState().shouldThrowError).toBe(false);
  });

  it('sets shouldThrowError to true when simulateError is called', () => {
    useErrorButtonStore.getState().simulateError();

    expect(useErrorButtonStore.getState().shouldThrowError).toBe(true);
  });

  it('keeps shouldThrowError true when simulateError is called again', () => {
    useErrorButtonStore.getState().simulateError();
    useErrorButtonStore.getState().simulateError();

    expect(useErrorButtonStore.getState().shouldThrowError).toBe(true);
  });
});
