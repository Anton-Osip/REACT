import type { Character } from '../api/character/getCharacters.type';

export const generateCSV = (items: Character[]): string => {
  const headers = [
    'ID',
    'Name',
    'Status',
    'Species',
    'Type',
    'Gender',
    'Origin Name',
    'Origin URL',
    'Location Name',
    'Location URL',
    'Image URL',
    'Episode Count',
    'First Episode',
    'Character URL',
    'Created Date',
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
      escapeCSV(character.type || ''),
      character.gender,
      escapeCSV(character.origin.name),
      character.origin.url,
      escapeCSV(character.location.name),
      character.location.url,
      character.image,
      character.episode.length,
      escapeCSV(character.episode[0] || ''),
      character.url,
      character.created,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
