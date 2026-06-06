import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFormsStore } from './forms.store.ts';
import type { FormSubmission } from './forms.types.ts';

const createFormSubmission = (
  overrides: Partial<FormSubmission> = {}
): FormSubmission => ({
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  termsAccepted: true,
  country: 'BLR',
  image: 'https://example.com/avatar.jpeg',
  formVariant: 'uncontrolled',
  ...overrides,
});

describe('useFormsStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });
  });

  it('prepends a new submission card', () => {
    useFormsStore.getState().addSubmissionCard(createFormSubmission());

    const { submissions } = useFormsStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      name: 'John',
      formVariant: 'uncontrolled',
    });
    expect(submissions[0]?.id).toBe(submissions[0]?.submittedAt);
  });

  it('sets lastAddedCardId when adding a submission', () => {
    useFormsStore.getState().addSubmissionCard(createFormSubmission());

    const { lastAddedCardId, submissions } = useFormsStore.getState();
    expect(lastAddedCardId).toBe(submissions[0]?.id);
  });

  it('clears lastAddedCardId after 3 seconds', () => {
    useFormsStore.getState().addSubmissionCard(createFormSubmission());

    vi.advanceTimersByTime(3000);

    expect(useFormsStore.getState().lastAddedCardId).toBeNull();
  });

  it('resets highlight timer when adding another submission', () => {
    useFormsStore.getState().addSubmissionCard(createFormSubmission());
    const firstId = useFormsStore.getState().lastAddedCardId;

    vi.advanceTimersByTime(2000);

    useFormsStore
      .getState()
      .addSubmissionCard(createFormSubmission({ name: 'Jane' }));
    const secondId = useFormsStore.getState().lastAddedCardId;

    expect(secondId).not.toBe(firstId);
    expect(useFormsStore.getState().lastAddedCardId).toBe(
      useFormsStore.getState().submissions[0]?.id
    );

    vi.advanceTimersByTime(2000);
    expect(useFormsStore.getState().lastAddedCardId).toBe(secondId);

    vi.advanceTimersByTime(1000);
    expect(useFormsStore.getState().lastAddedCardId).toBeNull();
  });
});
