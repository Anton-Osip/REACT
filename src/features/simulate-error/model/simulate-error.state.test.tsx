import { beforeEach, describe, expect, it } from 'vitest';

import { useSimulateErrorStore } from './simulate-error.state';

function resetStore() {
  useSimulateErrorStore.setState({ shouldThrowError: false });
}

describe('useSimulateErrorStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts with shouldThrowError set to false', () => {
    expect(useSimulateErrorStore.getState().shouldThrowError).toBe(false);
  });

  it('sets shouldThrowError to true when simulateError is called', () => {
    useSimulateErrorStore.getState().simulateError();

    expect(useSimulateErrorStore.getState().shouldThrowError).toBe(true);
  });

  it('keeps shouldThrowError true when simulateError is called again', () => {
    useSimulateErrorStore.getState().simulateError();
    useSimulateErrorStore.getState().simulateError();

    expect(useSimulateErrorStore.getState().shouldThrowError).toBe(true);
  });
});
