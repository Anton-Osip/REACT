import {
  type Country,
  SortField,
  type SortFieldType,
  SortOrder,
  type SortOrderType,
  type YearData,
} from '../types';

export const getAvailableColumns = (): string[] => {
  return [
    'year',
    'population',
    'co2',
    'co2_per_capita',
    'cement_co2',
    'cement_co2_per_capita',
    'coal_co2',
    'coal_co2_per_capita',
    'gas_co2',
    'gas_co2_per_capita',
    'oil_co2',
    'oil_co2_per_capita',
    'methane',
    'methane_per_capita',
    'nitrous_oxide',
    'nitrous_oxide_per_capita',
    'temperature_change_from_co2',
    'total_ghg',
    'total_ghg_per_capita',
  ];
};

export const createYearDataMap = (data: YearData[]): Map<number, YearData> => {
  const map = new Map<number, YearData>();

  data.forEach((d) => {
    map.set(d.year, d);
  });
  return map;
};

export const getPopulationForYear = (
  yearMap: Map<number, YearData>,
  year: number
): number | undefined => {
  return yearMap.get(year)?.population;
};

export const getCo2ForYear = (yearMap: Map<number, YearData>, year: number): number | undefined => {
  return yearMap.get(year)?.co2;
};

export const getAvailableYears = (countries: Country[]): number[] => {
  const years = new Set<number>();

  countries.forEach((country) => {
    country.data.forEach((yearData) => {
      years.add(yearData.year);
    });
  });

  return Array.from(years).sort((a, b) => a - b);
};

export const getCountryPopulation = (country: Country, year: number): number =>
  country.data.find((d) => d.year === year)?.population ?? 0;

export const sortCountries = (
  countries: Country[],
  sortField: SortFieldType,
  sortOrder: SortOrderType,
  selectedYear: number
): Country[] => {
  if (sortField === SortField.name) {
    return [...countries].sort((a, b) =>
      sortOrder === SortOrder.asc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    );
  }

  return countries
    .map((country) => ({ country, population: getCountryPopulation(country, selectedYear) }))
    .sort((a, b) =>
      sortOrder === SortOrder.asc ? a.population - b.population : b.population - a.population
    )
    .map(({ country }) => country);
};
