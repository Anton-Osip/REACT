import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useCo2Data } from '../../hooks/useCo2Data';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { SearchBar } from '../search-bar/search-bar';
import { YearSelector } from '../year-selector/year-selector';
import { CountryList } from '../country-list/country-list';
import { ColumnModal } from '../column-modal/column-modal';
import { getAvailableYears } from '../../utils/data-transformers';
import { SortField, type SortFieldType, SortOrder, type SortOrderType } from '../../types';

import styles from './app.module.css';

export const App = () => {
  const { data, isLoading, error } = useCo2Data();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2020);
  const [sortField, setSortField] = useState<SortFieldType>(SortField.population);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(SortOrder.desc);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'year',
    'population',
    'co2',
    'co2_per_capita',
  ]);

  const years = useMemo(() => (data ? getAvailableYears(data) : []), [data]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleSortFieldChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortFieldType;
    setSortField(value);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prevState: SortOrderType) =>
      prevState === SortOrder.asc ? SortOrder.desc : SortOrder.asc
    );
  }, []);

  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns((prevState) =>
      prevState.includes(column) ? prevState.filter((c) => c !== column) : [...prevState, column]
    );
  }, []);

  const handleModalToggle = useCallback(() => {
    setIsColumnModalOpen((prevState) => !prevState);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>;
  }

  if (!data) {
    return <div className={styles.noDataMessage}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CO₂ Emissions Data Explorer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <YearSelector year={selectedYear} years={years} onChange={handleYearChange} />

        <div className={styles.sortContainer}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select value={sortField} onChange={handleSortFieldChange} className={styles.sortSelect}>
            <option value={SortField.population}>Population</option>
            <option value={SortField.name}>Name</option>
          </select>

          <button onClick={handleSortOrderToggle} className={styles.sortButton}>
            {sortOrder === SortOrder.asc ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className={styles.columnButtonContainer}>
          <button onClick={handleModalToggle} className={styles.columnButton}>
            Select columns ({selectedColumns.length} selected)
          </button>
        </div>
      </div>

      {/* Country List */}
      <CountryList
        countries={data}
        searchQuery={searchQuery}
        selectedColumns={selectedColumns}
        selectedYear={selectedYear}
        sortField={sortField}
        sortOrder={sortOrder}
        onYearChange={handleYearChange}
      />

      {/* Column Modal */}
      <ColumnModal
        isOpen={isColumnModalOpen}
        selectedColumns={selectedColumns}
        onToggle={handleColumnToggle}
        onClose={handleModalToggle}
      />
    </div>
  );
};
