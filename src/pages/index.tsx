import { createFileRoute } from '@tanstack/react-router';
import { CharacterPage, STORAGE_KEY } from './character/-character-page';
import { loadFromStorage } from '../utils';

function readSearchFromUrl(raw: Record<string, unknown>): string | undefined {
  if (!('search' in raw)) return undefined;
  const v = raw.search;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (Array.isArray(v)) {
    const first = v[0];
    if (first === undefined || first === null) return '';
    if (typeof first === 'string') return first;
    if (typeof first === 'number' && Number.isFinite(first))
      return String(first);
    return String(first);
  }
  if (v === undefined || v === null) return '';
  return String(v);
}

export const Route = createFileRoute('/')({
  component: CharacterPage,
  validateSearch: (raw: Record<string, unknown>) => {
    const searchFromStorage = loadFromStorage<string>(STORAGE_KEY, '');
    const page = Number(raw.page);
    const details = Number(raw.details);
    const urlSearch = readSearchFromUrl(raw);

    return {
      search: urlSearch !== undefined ? urlSearch : searchFromStorage || '',
      page: Number.isFinite(page) && page > 0 ? page : 1,
      details: Number.isFinite(details) ? details : undefined,
    };
  },
});
