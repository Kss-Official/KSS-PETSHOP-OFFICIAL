import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  filterOptions?: FilterOption[];
  filterKey?: keyof T | ((row: T) => string);
  filterLabel?: string;
  beforeSearch?: React.ReactNode;
  actions?: React.ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
  defaultRowsPerPage?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search...',
  searchKey,
  filterOptions,
  filterKey,
  filterLabel = 'All Statuses',
  beforeSearch,
  actions,
  emptyTitle = 'No data found',
  emptySubtitle = 'Try adjusting your search or filters to find what you are looking for.',
  defaultRowsPerPage = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // 1. Text Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        let targetValue = '';
        if (typeof searchKey === 'function') {
          targetValue = searchKey(row);
        } else if (searchKey && row[searchKey]) {
          targetValue = String(row[searchKey]);
        } else {
          // fallback: stringify entire row
          targetValue = Object.values(row).join(' ');
        }
        if (!targetValue.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Select Filter
      if (selectedFilter) {
        let filterVal = '';
        if (typeof filterKey === 'function') {
          filterVal = filterKey(row);
        } else if (filterKey && row[filterKey] !== undefined) {
          filterVal = String(row[filterKey]);
        }
        if (filterVal !== selectedFilter) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, searchKey, selectedFilter, filterKey]);

  // Sorted Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(String(bVal))
          : String(bVal).localeCompare(aVal);
      }

      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginated Data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const getFlexAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'justify-center';
    if (align === 'right') return 'justify-end';
    return 'justify-start';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBE8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 border-b border-[#F3F4F6] flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white">
        <div className="flex flex-1 items-center gap-3 max-w-xl">
          {beforeSearch}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] transition-all text-[#111827] placeholder-[#9CA3AF]"
            />
          </div>

          {filterOptions && filterOptions.length > 0 && (
            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-[#F9FAF8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C] text-[#374151] font-medium"
            >
              <option value="">{filterLabel}</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#111827]">
          <thead className="bg-[#FAFAF9] text-[11px] font-bold text-[#16241B] uppercase tracking-wider border-b border-[#EBEBE8]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 ${getAlignClass(col.align)} ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1.5 ${getFlexAlignClass(col.align)} ${col.sortable ? 'cursor-pointer select-none hover:text-[#111827]' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#9CA3AF]">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#3FA65C]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#3FA65C]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={`skel-${index}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 ${getAlignClass(col.align)}`}>
                      <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#111827]">{emptyTitle}</h4>
                    <p className="text-xs text-[#6B7280] mt-1">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-[#F9FAF8] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 ${getAlignClass(col.align)} ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280] bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-[#1B2B1E] font-medium"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ml-2">
              Showing <span className="font-semibold text-[#111827]">{totalItems === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#111827]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#111827]">{totalItems}</span> results
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 font-semibold text-[#111827]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
