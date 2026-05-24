import type { CharacterPreview } from '../../features/character/api/getCharacters.type.ts';

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
      character.id,
      escapeCSV(character.name),
      character.status,
      escapeCSV(character.species),
      escapeCSV(character.location.name),
      character.location.url,
      character.image,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
