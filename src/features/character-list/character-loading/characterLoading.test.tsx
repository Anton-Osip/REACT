import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { CharacterLoading } from './character-loading';

describe('CharacterLoading', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when isLoading is false', () => {
    const { container } = render(<CharacterLoading isLoading={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a grid with the default number of skeletons when loading', () => {
    const { container } = render(<CharacterLoading isLoading />);

    const root = container.firstElementChild;
    expect(root).toBeInstanceOf(HTMLDivElement);
    const grid = root?.firstElementChild;
    expect(grid).toBeInstanceOf(HTMLDivElement);
    expect(grid?.children).toHaveLength(20);
  });

  it('renders the requested number of skeletons when length is set', () => {
    const { container } = render(<CharacterLoading isLoading length={5} />);

    expect(
      container.firstElementChild?.firstElementChild?.children
    ).toHaveLength(5);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <CharacterLoading isLoading className="custom-loading-grid" />
    );

    expect(container.firstElementChild).toHaveClass('custom-loading-grid');
  });
});
