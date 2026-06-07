import { memo, useMemo } from 'react';
import type { Country, SortFieldType, SortOrderType } from '../../types';
import { sortCountries } from '../../utils/data-transformers';
import { CountryCard } from '../country-card/country-card';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedYear: number;
  sortField: SortFieldType;
  sortOrder: SortOrderType;
  onYearChange: (year: number) => void;
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      const filtered = countries.filter((c) =>
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return sortCountries(filtered, sortField, sortOrder, selectedYear);
    }, [countries, searchQuery, selectedYear, sortField, sortOrder]);

    return (
      <div className={styles.countryList}>
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            selectedYear={selectedYear}
            selectedColumns={selectedColumns}
          />
        ))}
      </div>
    );
  }
);
