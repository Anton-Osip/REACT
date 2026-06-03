import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FileField } from './file-field.tsx';

const renderFileField = (
  props: {
    onChange?: (files: FileList | null) => void;
    onBlur?: () => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    label?: string;
    className?: string;
    errorText?: string;
  } = {}
) => {
  const onChange = props.onChange ?? vi.fn();

  return {
    onChange,
    ...render(
      <FileField
        onChange={onChange}
        onBlur={props.onBlur}
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        label={props.label}
        className={props.className}
        errorText={props.errorText}
      />
    ),
  };
};

const getFileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe('FileField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders file input and trigger button', () => {
    const { container } = renderFileField();

    expect(getFileInput(container)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders default label on the button', () => {
    renderFileField();

    expect(screen.getByRole('button')).toHaveTextContent('select file');
  });

  it('renders custom label on the button', () => {
    renderFileField({ label: 'Upload document' });

    expect(screen.getByRole('button')).toHaveTextContent('Upload document');
  });

  it('passes accept and multiple attributes to the file input', () => {
    const { container } = renderFileField({
      accept: 'image/*,application/pdf',
      multiple: true,
    });

    const input = getFileInput(container);

    expect(input).toHaveAttribute('accept', 'image/*,application/pdf');
    expect(input).toHaveAttribute('multiple');
  });

  it('calls onChange with selected files', () => {
    const onChange = vi.fn<(files: FileList | null) => void>();
    const { container } = renderFileField({ onChange });
    const input = getFileInput(container);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file],
    });
    fireEvent.change(input);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]?.[0]).toBe(file);
  });

  it('opens file dialog when button is clicked', () => {
    const { container } = renderFileField();
    const input = getFileInput(container);
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('disables input and button when disabled', () => {
    const { container } = renderFileField({ disabled: true });

    expect(getFileInput(container)).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not open file dialog when disabled button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderFileField({ disabled: true });
    const input = getFileInput(container);
    const clickSpy = vi.spyOn(input, 'click');

    await user.click(screen.getByRole('button'));

    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('merges custom className onto the root element', () => {
    const { container } = renderFileField({ className: 'extra-class' });

    expect(container.querySelector('.extra-class')).toBeInTheDocument();
  });

  it('renders error text when provided', () => {
    renderFileField({ errorText: 'File is required' });

    expect(screen.getByText('File is required')).toBeInTheDocument();
  });

  it('assigns inputRef callback when provided', () => {
    const inputRef = vi.fn();
    const { container } = render(
      <FileField onChange={vi.fn()} inputRef={inputRef} />
    );

    expect(inputRef).toHaveBeenCalledWith(getFileInput(container));
  });

  it('forwards null to inputRef callback on unmount', () => {
    const inputRef = vi.fn();
    const { container, unmount } = render(
      <FileField onChange={vi.fn()} inputRef={inputRef} />
    );
    const input = getFileInput(container);

    expect(inputRef).toHaveBeenCalledWith(input);

    unmount();

    expect(inputRef).toHaveBeenLastCalledWith(null);
  });

  it('calls onBlur when input loses focus', () => {
    const onBlur = vi.fn();
    const { container } = renderFileField({ onBlur });
    const input = getFileInput(container);

    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
