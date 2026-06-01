import type { CharacterPreview } from '../../features/character/api/getCharacters.type.ts';

export const CSV_UTF8_BOM = '\uFEFF';
export const CSV_MIME_TYPE = 'text/csv;charset=utf-8;';

export type CsvDownloadMeta = {
  url: string;
  fileName: string;
  blob: Blob;
};

export const createCsvDownloadMeta = (
  items: CharacterPreview[]
): CsvDownloadMeta | null => {
  if (items.length === 0) return null;

  const csvData = generateCSV(items);
  const blob = new Blob([CSV_UTF8_BOM + csvData], { type: CSV_MIME_TYPE });

  return {
    url: URL.createObjectURL(blob),
    fileName: `${items.length}_characters.csv`,
    blob,
  };
};

export const generateCSV = (items: CharacterPreview[]): string => {
  const headers = [
    'ID',
    'Name',
    'Status',
    'Species',
    'Location Name',
    'Location URL',
    'Image URL',
  ];

  const rows = items.map((character) => {
    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === undefined || value === null) return '';
      const stringValue = String(value);
      if (
        stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    return [
      escapeCSV(character.id),
      escapeCSV(character.name),
      escapeCSV(character.status),
      escapeCSV(character.species),
      escapeCSV(character.location.name),
      escapeCSV(character.location.url),
      escapeCSV(character.image),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
