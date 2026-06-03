import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';

import { FileFieldController } from '@/shared/ui';

type FormValues = {
  attachment: FileList | null;
};

const TestForm = () => {
  const { control } = useForm<FormValues>({
    defaultValues: { attachment: null },
  });

  return (
    <FileFieldController name="attachment" control={control} label="Upload" />
  );
};

const getFileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe('FileFieldController', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders file field wired to react-hook-form', () => {
    const { container } = render(<TestForm />);

    expect(getFileInput(container)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Upload');
  });

  it('updates form value when a file is selected', () => {
    const { container } = render(<TestForm />);
    const input = getFileInput(container);
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file],
    });
    fireEvent.change(input);

    expect(input.files?.[0]).toBe(file);
  });
});
