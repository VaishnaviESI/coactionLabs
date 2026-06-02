import { Fragment, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SortDirection = 'asc' | 'desc';

export interface SortableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  getValue?: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Array<SortableColumn<T>>;
  emptyMessage?: string;
  initialSortKey?: string;
  initialSortDirection?: SortDirection;
  rowKey?: (row: T, index: number) => string;
  rowClassName?: (row: T, index: number) => string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  /** Return child rows for a given row, or undefined/empty array if none. */
  getChildren?: (row: T) => T[] | undefined;
  /** Optional className override for subrows. */
  subrowClassName?: (row: T, parentIndex: number, childIndex: number) => string;
}

const SortableTable = <T,>({
  data,
  columns,
  emptyMessage = 'No results found.',
  initialSortKey,
  initialSortDirection = 'asc',
  rowKey,
  rowClassName,
  tableClassName,
  headerClassName,
  headerRowClassName,
  bodyClassName,
  getChildren,
  subrowClassName,
}: SortableTableProps<T>) => {
  const defaultSortKey = initialSortKey ?? columns.find((col) => col.sortable !== false)?.key ?? null;
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const sorted = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    const column = columns.find((col) => col.key === sortKey);
    if (!column) {
      return data;
    }

    const getValue = column.getValue ?? ((row: T) => (row as Record<string, string | number>)[sortKey] ?? '');

    return [...data].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aText = String(aValue ?? '').toLowerCase();
      const bText = String(bValue ?? '').toLowerCase();
      const comparison = aText.localeCompare(bText);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [columns, data, sortDirection, sortKey]);

  const toggleSort = (key: string, sortable = true) => {
    if (!sortable) {
      return;
    }

    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <table className={cn('min-w-full border-collapse text-sm', tableClassName)}>
      <thead className={cn('bg-slate-900 text-white', headerClassName)}>
        <tr className={headerRowClassName}>
          {getChildren && (
            <th className="w-8 px-2 py-3" aria-label="Expand" />
          )}
          {columns.map((column) => {
            const sortable = column.sortable !== false;
            return (
              <th
                key={column.key}
                className={cn('px-4 py-3 text-left text-xs font-bold tracking-wider uppercase', column.headerClassName)}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key, sortable)}
                    className="inline-flex w-full items-center justify-between gap-2 text-left hover:text-slate-200"
                  >
                    <span>{column.label}</span>
                    <span
                      className={cn(
                        'flex flex-col text-[8px] leading-[8px]',
                        sortKey === column.key ? 'text-white' : 'text-white/50',
                      )}
                    >
                      <span>▲</span>
                      <span>▼</span>
                    </span>
                  </button>
                ) : (
                  <span>{column.label}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={bodyClassName}>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (getChildren ? 1 : 0)} className="px-4 py-8 text-center text-slate-400">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          sorted.map((row, index) => {
            const key = rowKey ? rowKey(row, index) : String(index);
            const children = getChildren?.(row);
            const hasChildren = Boolean(children && children.length > 0);
            const isExpanded = expandedRows.has(key);

            return (
              <Fragment key={key}>
                <tr className={rowClassName?.(row, index)}>
                  {getChildren && (
                    <td className="w-8 px-2 py-3 text-center">
                      {hasChildren ? (
                        <button
                          type="button"
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpanded(key)}
                          className="rounded p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-[10px] leading-[10px]">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </button>
                      ) : null}
                    </td>
                  )}
                  {columns.map((column) => {
                    const cellValue = column.render
                      ? column.render(row)
                      : (column.getValue?.(row) ?? (row as Record<string, string | number>)[column.key] ?? '');
                    return (
                      <td key={column.key} className={cn('px-4 py-3', column.cellClassName)}>
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
                {hasChildren && isExpanded && children!.map((child, childIndex) => (
                  <tr
                    key={`${key}-sub-${childIndex}`}
                    className={
                      subrowClassName
                        ? subrowClassName(child, index, childIndex)
                        : 'bg-slate-50 border-l-4 border-l-slate-300'
                    }
                  >
                    {getChildren && <td className="w-8 px-2 py-2" />}
                    {columns.map((column, colIndex) => {
                      const cellValue = column.render
                        ? column.render(child)
                        : (column.getValue?.(child) ?? (child as Record<string, string | number>)[column.key] ?? '');
                      return (
                        <td
                          key={column.key}
                          className={cn(
                            'px-4 py-2 text-sm text-slate-600',
                            colIndex === 1 && 'pl-10',
                            column.cellClassName,
                          )}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default SortableTable;
