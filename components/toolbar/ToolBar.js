'use client';

import {
  useHistoryData,
  useHistoryFilters,
  useHistoryPagination,
} from '../context/HistoryContext';
import PaginationMenu from '../table/PaginationMenu';
import DateRangePicker from './DateRangePicker';
import FilterBy from './FilterBy';
import ItemsPerPage from './ItemsPerPage';
import SearchBar from './SearchBar';
import SortBy from './SortBy';

export default function ToolBar() {
  const { totalCount } = useHistoryData();
  const { sortBy, setSortBy, search, setSearch } = useHistoryFilters();
  const { page, setPage, itemsPerPage, setItemsPerPage } = useHistoryPagination();

  return (
    <div className="flex flex-col gap-3 mt-5 md:flex-row md:justify-between md:items-center md:gap-5">
      {/* Mobile: Row 1 (full width search) / Desktop: Center column */}
      <div className="order-1 w-full md:order-2 md:w-[30%] flex justify-center">
        <SearchBar setSearch={setSearch} search={search} />
      </div>

      {/* Mobile: Row 2 (filters + pagination) / Desktop: Right column */}
      <div className="order-2 flex justify-between items-center gap-3 md:order-3 md:justify-end md:gap-5 md:w-[30%]">
        <div className="flex items-center gap-2 md:gap-5">
          <DateRangePicker />
          <FilterBy />
        </div>
        <PaginationMenu
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          count={totalCount}
          style="compact"
        />
      </div>

      {/* Mobile: Row 3 (display controls) / Desktop: Left column */}
      <div className="order-3 flex justify-between items-center md:order-1 md:justify-start md:gap-3 md:w-[30%]">
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
        <SortBy sortBy={sortBy} setSortBy={setSortBy} />
      </div>
    </div>
  );
}
