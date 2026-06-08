import { memo, useMemo } from 'react';
import type { Country, SortFieldType, SortOrderType } from '../../types';
import { sortCountries } from '../../utils/data-transformers';
import { CountryCard } from '../country-card/country-card';

import styles from './country-list.module.css';
import {  useWindowVirtualizer } from '@tanstack/react-virtual';

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

    const virtualizer = useWindowVirtualizer({
      count: filteredCountries.length,
      estimateSize: () => 280,
      gap: 16,
    });


    return (
      <div className={styles.countryList}   style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative',
        width: '100%',
      }}>
     {virtualizer.getVirtualItems().map((virtualItem) => {
  const item = filteredCountries[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className={styles.virtualWrapper}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <CountryCard
                country={item}
                selectedYear={selectedYear}
                selectedColumns={selectedColumns}
              />
            </div>
          );
        })}
      </div>
    );
  }
);
